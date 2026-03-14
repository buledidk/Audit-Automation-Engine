import { describe, it, expect } from 'vitest'
import { ThreeWayMerge, ConflictDetector } from '../../lib/conflictResolver'

describe('ThreeWayMerge', () => {
  describe('Non-Conflicting Merges', () => {
    it('merges when different fields changed', () => {
      const base = { procedures: ['P1'], exceptions: 0 }
      const current = { procedures: ['P1', 'P2'], exceptions: 0 }
      const incoming = { procedures: ['P1'], exceptions: 1 }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.autoMergeSuccessful).toBe(true)
      expect(result.merged.procedures).toEqual(['P1', 'P2'])
      expect(result.merged.exceptions).toBe(1)
    })

    it('merges when both make identical changes', () => {
      const base = { title: 'Original' }
      const current = { title: 'Updated' }
      const incoming = { title: 'Updated' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.autoMergeSuccessful).toBe(true)
      expect(result.merged.title).toBe('Updated')
    })

    it('uses incoming when current unchanged', () => {
      const base = { status: 'Draft' }
      const current = { status: 'Draft' }
      const incoming = { status: 'Reviewed' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.status).toBe('Reviewed')
    })

    it('uses current when incoming unchanged', () => {
      const base = { status: 'Draft' }
      const current = { status: 'Reviewed' }
      const incoming = { status: 'Draft' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.status).toBe('Reviewed')
    })
  })

  describe('Array Field Merges', () => {
    it('merges array additions from both sides', () => {
      const base = { procedures: ['P1', 'P2'] }
      const current = { procedures: ['P1', 'P2', 'P3'] }
      const incoming = { procedures: ['P1', 'P2', 'P4'] }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.autoMergeSuccessful).toBe(true)
      expect(result.merged.procedures).toContain('P1')
      expect(result.merged.procedures).toContain('P2')
      expect(result.merged.procedures).toContain('P3')
      expect(result.merged.procedures).toContain('P4')
    })

    it('respects common removals', () => {
      const base = { procedures: ['P1', 'P2', 'P3'] }
      const current = { procedures: ['P1', 'P2'] } // Removed P3
      const incoming = { procedures: ['P1', 'P2'] } // Also removed P3

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.procedures).toEqual(['P1', 'P2'])
    })

    it('handles complex array objects', () => {
      const base = [{ id: 1, name: 'Item 1' }]
      const current = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]
      const incoming = [{ id: 1, name: 'Item 1' }, { id: 3, name: 'Item 3' }]

      const result = ThreeWayMerge.merge(
        { items: base },
        { items: current },
        { items: incoming }
      )

      expect(result.merged.items).toHaveLength(3)
    })

    it('deduplicates array items', () => {
      const base = ['P1', 'P2']
      const current = ['P1', 'P2', 'P3']
      const incoming = ['P1', 'P2', 'P3']

      const result = ThreeWayMerge.merge(
        { procedures: base },
        { procedures: current },
        { procedures: incoming }
      )

      expect(result.merged.procedures).toEqual(['P1', 'P2', 'P3'])
    })
  })

  describe('Object Field Merges', () => {
    it('recursively merges nested objects', () => {
      const base = { metadata: { version: 1, editor: 'userA' } }
      const current = { metadata: { version: 2, editor: 'userA' } }
      const incoming = { metadata: { version: 1, editor: 'userB' } }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.metadata.version).toBe(2)
      expect(result.merged.metadata.editor).toBe('userB')
    })

    it('handles deeply nested structures', () => {
      const base = {
        audit: { procedures: [{ id: 1, status: 'Pending' }] }
      }
      const current = {
        audit: { procedures: [{ id: 1, status: 'Complete' }] }
      }
      const incoming = {
        audit: { procedures: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Pending' }] }
      }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.audit.procedures).toHaveLength(2)
      expect(result.merged.audit.procedures[0].status).toBe('Complete')
    })
  })

  describe('True Conflict Detection', () => {
    it('detects conflict when both change same field incompatibly', () => {
      const base = { title: 'Original' }
      const current = { title: 'Version A' }
      const incoming = { title: 'Version B' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.hasConflicts).toBe(true)
      expect(result.conflicts).toHaveLength(1)
      expect(result.conflicts[0].field).toBe('title')
    })

    it('reports conflict with reason and suggestion', () => {
      const base = { status: 'Draft' }
      const current = { status: 'Reviewed' }
      const incoming = { status: 'Rejected' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.conflicts[0].reason).toBeDefined()
      expect(result.conflicts[0].suggestion).toBeDefined()
    })

    it('defaults to server version for conflicts', () => {
      const base = { amount: 1000 }
      const current = { amount: 1500 }
      const incoming = { amount: 2000 }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.amount).toBe(1500) // Server's version
    })

    it('detects multiple conflicts', () => {
      const base = { title: 'A', status: 'Draft', owner: 'User1' }
      const current = { title: 'B', status: 'Reviewed', owner: 'User1' }
      const incoming = { title: 'C', status: 'Rejected', owner: 'User1' }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.conflicts).toHaveLength(2)
      expect(result.conflicts.map(c => c.field)).toContain('title')
      expect(result.conflicts.map(c => c.field)).toContain('status')
    })
  })

  describe('Edge Cases', () => {
    it('handles null/undefined values', () => {
      const base = { value: null }
      const current = { value: 'set' }
      const incoming = { value: null }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.value).toBe('set')
    })

    it('handles empty objects', () => {
      const result = ThreeWayMerge.merge({}, {}, {})

      expect(result.merged).toEqual({})
      expect(result.hasConflicts).toBe(false)
    })

    it('handles empty arrays', () => {
      const base = { items: [] }
      const current = { items: [] }
      const incoming = { items: ['A'] }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged.items).toEqual(['A'])
    })

    it('handles type changes', () => {
      const base = { value: 'string' }
      const current = { value: 123 }
      const incoming = { value: false }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.hasConflicts).toBe(true)
    })

    it('ignores undefined fields', () => {
      const base = { a: 1, b: 2 }
      const current = { a: 1, b: 2 }
      const incoming = { a: 1 }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.merged).toEqual({ a: 1, b: 2 })
    })
  })

  describe('Real-World Scenarios', () => {
    it('merges working paper edit scenario', () => {
      const base = {
        procedures: ['Verify receipts', 'Check cutoff'],
        exceptions: [],
        comments: ['Initial review']
      }

      const current = {
        procedures: ['Verify receipts', 'Check cutoff', 'Recalculate totals'],
        exceptions: [],
        comments: ['Initial review']
      }

      const incoming = {
        procedures: ['Verify receipts', 'Check cutoff'],
        exceptions: [{ amount: 5000, description: 'Timing difference' }],
        comments: ['Initial review']
      }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.autoMergeSuccessful).toBe(true)
      expect(result.merged.procedures).toContain('Recalculate totals')
      expect(result.merged.exceptions).toHaveLength(1)
    })

    it('handles exception evaluation merge', () => {
      const base = {
        exceptions: [{ id: 1, status: 'Pending' }]
      }

      const current = {
        exceptions: [{ id: 1, status: 'Pending', evaluation: 'No adjustment needed' }]
      }

      const incoming = {
        exceptions: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Pending' }]
      }

      const result = ThreeWayMerge.merge(base, current, incoming)

      expect(result.autoMergeSuccessful).toBe(true)
    })
  })
})

describe('ConflictDetector', () => {
  it('detects version mismatch', () => {
    const conflict = ConflictDetector.detectConflict(1, 2)

    expect(conflict.detected).toBe(true)
    expect(conflict.type).toBe('version-mismatch')
  })

  it('returns null when no conflict', () => {
    const conflict = ConflictDetector.detectConflict(5, 5)

    expect(conflict).toBeNull()
  })

  it('creates version checkpoints', () => {
    const data = { id: 1, title: 'Test' }
    const checkpoint = ConflictDetector.createCheckpoint(data)

    expect(checkpoint.timestamp).toBeDefined()
    expect(checkpoint.checksum).toBeDefined()
    expect(checkpoint.snapshot).toEqual(data)
  })

  it('generates consistent checksums', () => {
    const data = { a: 1, b: 2 }

    const checksum1 = ConflictDetector.createCheckpoint(data).checksum
    const checksum2 = ConflictDetector.createCheckpoint(data).checksum

    expect(checksum1).toBe(checksum2)
  })

  it('generates different checksums for different data', () => {
    const data1 = { a: 1 }
    const data2 = { a: 2 }

    const checksum1 = ConflictDetector.createCheckpoint(data1).checksum
    const checksum2 = ConflictDetector.createCheckpoint(data2).checksum

    expect(checksum1).not.toBe(checksum2)
  })
})
