/**
 * Universal File Upload Component
 * SHA-256 hashing, drag-drop, version control, Supabase storage fallback to localStorage
 */

import { useState, useRef, useCallback } from 'react';
import { agentEventBus, EVENT_TYPES } from '../services/agentEventBus';

const COLORS = {
  bg: '#0A0E17', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8', dim: 'rgba(255,255,255,0.6)', faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A', red: '#EF5350', blue: '#42A5F5', accent: '#F5A623'
};

function isSupabaseConfigured() {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

async function computeSHA256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function FileUpload({
  context = 'general',
  contextId = '',
  onUploadComplete,
  maxFiles = 10,
  acceptTypes,
  showVersions = true,
  compact = false,
  label
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [versions, setVersions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`fileVersions_${context}_${contextId}`) || '{}');
    } catch { return {}; }
  });
  const inputRef = useRef(null);

  const saveVersions = useCallback((v) => {
    setVersions(v);
    localStorage.setItem(`fileVersions_${context}_${contextId}`, JSON.stringify(v));
  }, [context, contextId]);

  const processFiles = useCallback(async (fileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    if (newFiles.length === 0) return;

    setUploading(true);
    const results = [];

    for (const file of newFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setUploadProgress(prev => ({ ...prev, [id]: 0 }));

      try {
        // Simulate progress during SHA-256 computation
        setUploadProgress(prev => ({ ...prev, [id]: 20 }));
        const hash = await computeSHA256(file);
        setUploadProgress(prev => ({ ...prev, [id]: 50 }));

        // Version control: check for duplicate hash
        const existingVersion = versions[hash];
        const version = existingVersion ? existingVersion.version + 1 : 1;
        const updatedVersions = {
          ...versions,
          [hash]: { version, fileName: file.name, size: file.size, uploadedAt: new Date().toISOString() }
        };

        setUploadProgress(prev => ({ ...prev, [id]: 70 }));

        // Storage: Supabase or localStorage fallback
        let storageUrl = null;
        if (isSupabaseConfigured()) {
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            const path = `${context}/${contextId}/${hash}_v${version}_${file.name}`;
            const { data, error } = await supabase.storage
              .from('audit-evidence')
              .upload(path, file, { upsert: true });
            if (!error && data) storageUrl = data.path;
          } catch (e) {
            console.warn('[FileUpload] Supabase upload failed, using localStorage:', e.message);
          }
        }

        if (!storageUrl) {
          // localStorage fallback: store metadata only (not file data for size reasons)
          const lsKey = `file_${context}_${contextId}_${hash}`;
          localStorage.setItem(lsKey, JSON.stringify({
            name: file.name, size: file.size, hash, version,
            uploadedAt: new Date().toISOString(), type: file.type
          }));
          storageUrl = `local://${lsKey}`;
        }

        setUploadProgress(prev => ({ ...prev, [id]: 100 }));

        const fileRecord = {
          id, name: file.name, size: file.size, type: file.type,
          hash, version, storageUrl, uploadedAt: new Date().toISOString(),
          context, contextId, isDuplicate: !!existingVersion
        };

        results.push(fileRecord);
        saveVersions(updatedVersions);

        // Publish events
        agentEventBus.publish(EVENT_TYPES.EVIDENCE_UPLOADED, {
          fileId: id, fileName: file.name, hash, context, contextId, version
        });

        if (existingVersion) {
          agentEventBus.publish(EVENT_TYPES.FILE_VERSION_CREATED, {
            fileId: id, fileName: file.name, hash, previousVersion: existingVersion.version, newVersion: version
          });
        }
      } catch (err) {
        console.error('[FileUpload] Error processing file:', err);
        setUploadProgress(prev => ({ ...prev, [id]: -1 }));
      }
    }

    setFiles(prev => [...prev, ...results]);
    setUploading(false);
    if (onUploadComplete && results.length > 0) onUploadComplete(results);
  }, [files.length, maxFiles, versions, context, contextId, saveVersions, onUploadComplete]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setUploadProgress(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            padding: '6px 12px', background: COLORS.blue + '20', border: `1px solid ${COLORS.blue}40`,
            color: COLORS.blue, borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          📎 {label || 'Attach Files'}
        </button>
        {files.length > 0 && (
          <span style={{ color: COLORS.dim, fontSize: '11px' }}>{files.length} file(s)</span>
        )}
        <input
          ref={inputRef} type="file" multiple style={{ display: 'none' }}
          accept={acceptTypes} onChange={(e) => processFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <div style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>
          {label}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: '24px',
          border: `2px dashed ${dragOver ? COLORS.green : COLORS.border}`,
          borderRadius: '8px',
          background: dragOver ? COLORS.green + '08' : COLORS.card,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
        <div style={{ color: COLORS.text, fontSize: '13px', fontWeight: 600 }}>
          Drop files here or click to browse
        </div>
        <div style={{ color: COLORS.faint, fontSize: '11px', marginTop: '4px' }}>
          SHA-256 verified • Max {maxFiles} files • {acceptTypes || 'All types'}
        </div>
      </div>
      <input
        ref={inputRef} type="file" multiple style={{ display: 'none' }}
        accept={acceptTypes} onChange={(e) => processFiles(e.target.files)}
      />

      {/* Upload progress */}
      {Object.entries(uploadProgress).map(([id, pct]) => (
        pct >= 0 && pct < 100 ? (
          <div key={id} style={{ marginTop: '8px' }}>
            <div style={{
              height: '6px', borderRadius: '3px', background: COLORS.border, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: '3px',
                background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ color: COLORS.dim, fontSize: '10px', marginTop: '2px', textAlign: 'right' }}>
              {pct}%
            </div>
          </div>
        ) : null
      ))}

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          {files.map(f => (
            <div key={f.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: '6px', marginBottom: '4px'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: COLORS.text, fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                  {showVersions && f.version > 1 && (
                    <span style={{ color: COLORS.accent, marginLeft: '6px', fontSize: '10px' }}>v{f.version}</span>
                  )}
                  {f.isDuplicate && (
                    <span style={{ color: COLORS.accent, marginLeft: '6px', fontSize: '10px' }}>(updated)</span>
                  )}
                </div>
                <div style={{ color: COLORS.faint, fontSize: '10px', marginTop: '2px' }}>
                  {formatSize(f.size)} • SHA: {f.hash.slice(0, 12)}…
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                style={{
                  background: 'none', border: 'none', color: COLORS.red,
                  cursor: 'pointer', fontSize: '14px', padding: '4px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Version history */}
      {showVersions && Object.keys(versions).length > 0 && (
        <details style={{ marginTop: '12px' }}>
          <summary style={{ color: COLORS.dim, fontSize: '11px', cursor: 'pointer' }}>
            Version History ({Object.keys(versions).length} files tracked)
          </summary>
          <div style={{ marginTop: '8px' }}>
            {Object.entries(versions).map(([hash, v]) => (
              <div key={hash} style={{
                padding: '6px 10px', background: COLORS.card, borderRadius: '4px',
                marginBottom: '4px', fontSize: '11px', color: COLORS.dim
              }}>
                {v.fileName} — v{v.version} — {formatSize(v.size)} — {new Date(v.uploadedAt).toLocaleDateString()}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
