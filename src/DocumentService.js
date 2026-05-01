// ═══════════════════════════════════════════════════════════════
// DOCUMENT SERVICE — Persistent Document Storage
// AuditEngine v10 AURA — Phase 2 Batch 1
// Upload/download/delete with Supabase Storage + localStorage fallback
// ═══════════════════════════════════════════════════════════════

import { supabase, isSupabaseConfigured } from './supabaseClient';

const BUCKET = 'audit-documents';
const MAX_LOCAL_FILE_BYTES = 512 * 1024; // 500KB warning for localStorage mode

export async function uploadFile(engagementId, wpId, file) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const record = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    ext: file.name.split('.').pop().toLowerCase(),
    uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    wp_id: wpId,
    evidence_tag: null,
    uploaded_by: null,
    version: 1
  };

  if (isSupabaseConfigured()) {
    const storagePath = `${engagementId}/${wpId}/${id}_${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadErr) throw new Error('Upload failed: ' + uploadErr.message);

    record.storage_path = storagePath;

    const { error: metaErr } = await supabase.from('documents').insert({
      id, engagement_id: engagementId, wp_id: wpId,
      filename: file.name, mime_type: file.type, size_bytes: file.size,
      storage_path: storagePath, uploaded_at: record.uploadedAt
    });
    if (metaErr) console.warn('Document metadata insert failed:', metaErr);
  } else {
    // Standalone mode: store base64 in record for small files
    if (file.size <= MAX_LOCAL_FILE_BYTES) {
      const reader = new FileReader();
      record.base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      record.base64 = null; // Too large for localStorage — metadata only
      record._oversized = true;
    }
  }
  return record;
}

export async function getDownloadUrl(doc) {
  if (doc.base64) return doc.base64; // standalone mode data URL
  if (!isSupabaseConfigured() || !doc.storage_path) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET).createSignedUrl(doc.storage_path, 3600);
  if (error) { console.warn('Signed URL error:', error); return null; }
  return data.signedUrl;
}

export async function deleteDocument(doc, _engagementId) {
  if (isSupabaseConfigured() && doc.storage_path) {
    await supabase.storage.from(BUCKET).remove([doc.storage_path]);
    await supabase.from('documents').update({ deleted_at: new Date().toISOString() })
      .eq('id', doc.id);
  }
  // Standalone: caller removes from uploads state
}
