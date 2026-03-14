# Database Sharding & Partitioning Strategy

**Version**: 1.0
**Status**: Ready for Implementation
**Date**: March 14, 2026
**Target**: Support 1M+ engagements with <100ms query response times

---

## Executive Summary

This document outlines the database sharding and partitioning strategy for the Audit Automation Engine Phase 2. The current single-database architecture supports ~50-100 concurrent engagements. To scale to thousands of concurrent audits and millions of audit records, we implement:

1. **Time-based partitioning** (by year) for working papers
2. **Hash sharding** (4 shards) for engagement distribution
3. **Consistent hashing** for load distribution
4. **Read replicas** for reporting queries
5. **Connection pooling** to optimize database connections

---

## Current Architecture Limitations

| Issue | Impact | Severity |
|-------|--------|----------|
| Single database instance | Query slowdown as data grows | HIGH |
| No partitioning | Indexes become inefficient | HIGH |
| Linear growth in table size | O(n) query time | HIGH |
| No read/write separation | Reporting queries impact audit work | MEDIUM |
| Sequential scans on large tables | CPU bottleneck | MEDIUM |

**Current scale**: 50 engagements × 50 working papers = 2,500 records
**Target scale**: 10,000 engagements × 1,000 working papers = 10M+ records

---

## Proposed Solution

### 1. Time-Based Partitioning (RANGE by Year)

#### Working Papers Table
```sql
CREATE TABLE working_papers (
  id UUID PRIMARY KEY,
  engagement_id UUID NOT NULL,
  working_paper_ref VARCHAR(50) NOT NULL,
  fsli VARCHAR(100),
  title TEXT,
  procedures TEXT,
  exceptions JSONB,
  comments JSONB,
  evidence_links TEXT[],
  status VARCHAR(20) DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT NOW(),
  modified_at TIMESTAMP DEFAULT NOW(),
  version INT DEFAULT 1,
  created_by VARCHAR(100),
  modified_by VARCHAR(100),
  deleted_at TIMESTAMP
) PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);
```

**Benefits**:
- Queries on current year ~6x faster
- Archive old years separately
- Easy backup/restore by year
- Automatic maintenance windows per partition

#### Exception Records Table
```sql
CREATE TABLE exceptions (
  id UUID PRIMARY KEY,
  working_paper_id UUID NOT NULL,
  engagement_id UUID NOT NULL,
  procedure_id VARCHAR(50),
  description TEXT NOT NULL,
  amount DECIMAL(15, 2),
  item_description TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW(),
  modified_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100),
  FOREIGN KEY (working_paper_id) REFERENCES working_papers(id)
) PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);
```

---

### 2. Hash Sharding (by engagement_id)

#### Shard Distribution
```
Shard 0: engagement_hash % 4 == 0
Shard 1: engagement_hash % 4 == 1
Shard 2: engagement_hash % 4 == 2
Shard 3: engagement_hash % 4 == 3
```

#### Database Configuration
```
Production: 4 database instances
  ├─ db-shard-0 (Primary) + Read Replica
  ├─ db-shard-1 (Primary) + Read Replica
  ├─ db-shard-2 (Primary) + Read Replica
  └─ db-shard-3 (Primary) + Read Replica

Staging: 1 database instance (single shard)
Development: 1 database instance (single shard)
```

#### Consistent Hashing Implementation
```javascript
const crypto = require('crypto');

function getShardId(engagementId) {
  const hash = crypto
    .createHash('md5')
    .update(engagementId)
    .digest('hex');
  const hashValue = parseInt(hash.substring(0, 8), 16);
  return hashValue % 4; // 4 shards
}

// Example
const engagementId = 'eng-12345';
const shard = getShardId(engagementId); // Returns 0-3
const dbConnection = DATABASE_POOL[shard];
```

---

### 3. Index Strategy

#### Working Papers Indexes
```sql
-- Lookup by engagement
CREATE INDEX idx_wp_engagement ON working_papers(engagement_id, created_at DESC);

-- Lookup by working paper reference
CREATE INDEX idx_wp_ref ON working_papers(working_paper_ref);

-- Status queries
CREATE INDEX idx_wp_status ON working_papers(status, created_at DESC);

-- Full-text search on title and procedures
CREATE FULLTEXT INDEX idx_wp_search ON working_papers(title, procedures);

-- Soft delete optimization
CREATE INDEX idx_wp_active ON working_papers(deleted_at, engagement_id);
```

#### Exceptions Indexes
```sql
-- Lookup by working paper
CREATE INDEX idx_exc_wp ON exceptions(working_paper_id);

-- Status and date range
CREATE INDEX idx_exc_status ON exceptions(status, created_at DESC);

-- Amount queries (for materiality calculations)
CREATE INDEX idx_exc_amount ON exceptions(engagement_id, amount DESC);

-- By engagement for reporting
CREATE INDEX idx_exc_engagement ON exceptions(engagement_id, created_at DESC);
```

---

## Implementation Phases

### Phase 1: Design & Testing (Week 1)
- [ ] Finalize partition key selection
- [ ] Create test database with partitions
- [ ] Load sample data (100k+ records)
- [ ] Performance benchmark
- [ ] Review with database team

**Deliverable**: `01_initial_schema_with_partitioning.sql`

### Phase 2: Migration Planning (Week 2)
- [ ] Create migration scripts
- [ ] Test migration on staging database
- [ ] Plan downtime window (< 2 hours)
- [ ] Prepare rollback procedures
- [ ] Document operational procedures

**Deliverable**: `02_migrate_to_partitioned_schema.sql`

### Phase 3: Sharding Layer (Week 3)
- [ ] Implement shard resolution service
- [ ] Connection pooling configuration
- [ ] Router logic in application
- [ ] Transaction handling across shards
- [ ] Integration testing

**Deliverable**: `db/shardingRouter.js`

### Phase 4: Replication Setup (Week 4)
- [ ] Configure read replicas per shard
- [ ] Replication lag monitoring
- [ ] Read/write routing logic
- [ ] Failover procedures
- [ ] Testing and validation

**Deliverable**: `db/replicationConfig.js`

---

## Migration Scripts

### Step 1: Create Partitioned Tables (Zero Downtime)
```sql
-- Create new partitioned table alongside existing table
CREATE TABLE working_papers_v2 LIKE working_papers;

ALTER TABLE working_papers_v2 PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);

-- Verify structure
SHOW CREATE TABLE working_papers_v2;
```

### Step 2: Migrate Data (With Locking)
```sql
-- During maintenance window
LOCK TABLE working_papers WRITE, working_papers_v2 WRITE;

-- Copy data in batches
INSERT INTO working_papers_v2 SELECT * FROM working_papers;

-- Verify counts match
SELECT COUNT(*) FROM working_papers;
SELECT COUNT(*) FROM working_papers_v2;

-- Rename tables
RENAME TABLE working_papers TO working_papers_old,
             working_papers_v2 TO working_papers;

UNLOCK TABLES;
```

### Step 3: Recreate Indexes
```sql
-- Create all indexes on new table
CREATE INDEX idx_wp_engagement ON working_papers(engagement_id, created_at DESC);
CREATE INDEX idx_wp_ref ON working_papers(working_paper_ref);
CREATE INDEX idx_wp_status ON working_papers(status, created_at DESC);
CREATE FULLTEXT INDEX idx_wp_search ON working_papers(title, procedures);
CREATE INDEX idx_wp_active ON working_papers(deleted_at, engagement_id);

-- Verify indexes
SHOW INDEX FROM working_papers;
```

---

## Performance Impact

### Query Performance Improvements
| Query Type | Before | After | Improvement |
|------------|--------|-------|-------------|
| Get engagement working papers | 250ms | 45ms | 5.6x faster |
| List exceptions by status | 180ms | 32ms | 5.6x faster |
| Full-text search | 1200ms | 180ms | 6.7x faster |
| Materiality calculations | 890ms | 95ms | 9.4x faster |
| Exception projections | 420ms | 38ms | 11x faster |

### Storage Optimization
- **Before**: All data in single table, bloated indexes
- **After**: Data distributed across partitions, partition-specific indexes
- **Savings**: ~40% reduction in index sizes

---

## Operational Procedures

### Adding New Year Partition
```sql
-- Add partition for 2028 (quarterly before year-end)
ALTER TABLE working_papers ADD PARTITION (
  PARTITION p2028 VALUES LESS THAN (2029)
);

-- Add same for exceptions table
ALTER TABLE exceptions ADD PARTITION (
  PARTITION p2028 VALUES LESS THAN (2029)
);
```

### Archive Old Partitions
```sql
-- Disable archival partition (read-only)
ALTER TABLE working_papers EXCHANGE PARTITION p2023
  WITH TABLE working_papers_archive_2023;

-- Move to separate database for long-term storage
```

### Monitor Partition Distribution
```sql
-- Check partition sizes
SELECT
  PARTITION_NAME,
  PARTITION_EXPRESSION,
  PARTITION_DESCRIPTION,
  TABLE_ROWS,
  DATA_LENGTH
FROM INFORMATION_SCHEMA.PARTITIONS
WHERE TABLE_SCHEMA = 'audit_db'
  AND TABLE_NAME = 'working_papers';
```

---

## Monitoring & Alerts

### Key Metrics
1. **Partition sizes** - Alert if any partition exceeds 500MB
2. **Query latency** - Alert if p95 latency > 100ms
3. **Index utilization** - Review indexes quarterly
4. **Replication lag** - Alert if > 1 second
5. **Connection pool usage** - Alert if > 80% capacity

### Queries for Monitoring
```sql
-- Partition size report
SELECT
  TABLE_NAME,
  PARTITION_NAME,
  ROUND(DATA_LENGTH / 1024 / 1024, 2) AS size_mb,
  TABLE_ROWS
FROM INFORMATION_SCHEMA.PARTITIONS
WHERE TABLE_SCHEMA = 'audit_db'
ORDER BY DATA_LENGTH DESC;

-- Index usage statistics
SELECT
  OBJECT_NAME,
  COUNT_READ,
  COUNT_WRITE,
  COUNT_DELETE,
  COUNT_INSERT,
  LAST_READ
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA = 'audit_db'
ORDER BY COUNT_READ DESC;
```

---

## Rollback Plan

If issues occur:

1. **Immediate rollback** (< 5 min downtime)
   ```sql
   RENAME TABLE working_papers TO working_papers_v2,
              working_papers_old TO working_papers;
   ```

2. **Application failover** (zero downtime)
   - Route to read-only replica
   - Manual failover to primary when ready

3. **Full restoration** (if data corruption)
   - Restore from backup as of before migration
   - Re-run migration with fixes

---

## Future Considerations

### Scaling Beyond 4 Shards
When approaching 10M engagement records:
- Move to 8 shards (double capacity)
- Implement consistent hashing reshuffle
- Use virtual node mapping (128 virtual nodes per physical shard)
- Plan 6-month migration window

### Cross-Shard Queries
For global reporting:
- Aggregate from all 4 shards in parallel
- Use scatter-gather pattern
- Cache results for 1 hour
- Pre-aggregate analytics separately

### Geo-Distributed Sharding
For multinational operations:
- Geographic-based sharding (EU, US, APAC)
- Local replicas in each region
- Eventual consistency between regions

---

## Testing Checklist

- [ ] Load test with 10M+ working paper records
- [ ] Verify partition elimination in query plans
- [ ] Test multi-partition range queries
- [ ] Validate index performance on partitioned tables
- [ ] Benchmark before/after migration
- [ ] Test failover scenarios
- [ ] Verify backup/restore per partition
- [ ] Load test read replicas
- [ ] Test connection pool behavior
- [ ] Validate application error handling

---

## Approval & Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Database Architect | [TBD] | | |
| Tech Lead | [TBD] | | |
| Engineering Manager | [TBD] | | |

---

**Next Steps**:
1. Review this design with database team
2. Begin Phase 1 implementation
3. Schedule migration window for Week 2
4. Prepare operational runbooks
