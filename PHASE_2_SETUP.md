# 🚀 AuditEngine Phase 2 - Database & Storage Setup

**Status**: Ready for implementation
**Phase 1 Status**: ✅ PRODUCTION READY
**Estimated Implementation Time**: 1-2 weeks

---

## 📋 Phase 2 Roadmap

This document guides you through implementing persistent storage, cloud deployment, and team collaboration features for AuditEngine.

### Phase 2 Features
1. ✅ Supabase PostgreSQL database integration
2. ✅ Real-time data synchronization
3. ✅ AWS S3 working paper file storage
4. ✅ Vercel production deployment
5. ✅ Team collaboration (multi-user access)

---

## 1️⃣ SUPABASE DATABASE SETUP

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Configure:
   - **Name**: `audit-engine`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users (EU-West-2 for UK)
5. Wait for initialization (2-3 minutes)
6. Copy your connection strings:
   - **Project URL**: (shown in Settings → API)
   - **Anon Key**: (shown in Settings → API)

### 1.2 Create Database Tables

Execute the following SQL in Supabase SQL Editor:

```sql
-- Engagements table (master data)
CREATE TABLE engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name VARCHAR(255) NOT NULL,
  entity_id VARCHAR(50),
  industry_id VARCHAR(50),
  sector VARCHAR(100),
  framework VARCHAR(50), -- FRS 102, IFRS, etc.
  entity_size VARCHAR(20), -- Micro, Small, Medium, Large
  financial_year_end DATE NOT NULL,
  audit_period_start DATE NOT NULL,
  audit_period_end DATE NOT NULL,

  -- Team
  partner_name VARCHAR(255),
  manager_name VARCHAR(255),
  senior_auditor_name VARCHAR(255),
  junior_auditors TEXT, -- JSON array

  -- Materiality
  overall_materiality NUMERIC(12,2),
  performance_materiality NUMERIC(12,2),
  trivial_threshold NUMERIC(12,2),
  materiality_basis VARCHAR(50), -- PBT, Revenue, etc.
  materiality_justification TEXT,

  -- Phase status
  planning_complete BOOLEAN DEFAULT FALSE,
  risk_assessment_complete BOOLEAN DEFAULT FALSE,
  interim_complete BOOLEAN DEFAULT FALSE,
  final_audit_complete BOOLEAN DEFAULT FALSE,
  completion_complete BOOLEAN DEFAULT FALSE,
  reporting_complete BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,

  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Working papers table
CREATE TABLE working_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  ref_code VARCHAR(10) NOT NULL, -- A1, B2, C1, D3, etc.
  wp_name VARCHAR(255) NOT NULL,
  phase VARCHAR(50), -- Planning, Risk, Interim, Final, Completion, Reporting
  status VARCHAR(20), -- pending, in_progress, complete
  prepared_by UUID,
  prepared_date TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  reviewed_date TIMESTAMP WITH TIME ZONE,
  data JSONB, -- Store WP-specific data

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_engagement FOREIGN KEY (engagement_id) REFERENCES engagements(id) ON DELETE CASCADE
);

-- Audit trail table
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  action VARCHAR(100), -- create, update, delete, sign_off, etc.
  table_name VARCHAR(50),
  record_id VARCHAR(50),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_engagement FOREIGN KEY (engagement_id) REFERENCES engagements(id) ON DELETE CASCADE
);

-- Issues/Misstatements table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  fsli_area VARCHAR(10), -- D3, D4, etc.
  issue_type VARCHAR(20), -- misstatement, exception, finding
  description TEXT NOT NULL,
  amount NUMERIC(12,2),
  status VARCHAR(20), -- open, resolved, waived
  resolution_notes TEXT,
  raised_by UUID,
  raised_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_by UUID,
  resolved_date TIMESTAMP WITH TIME ZONE,

  CONSTRAINT fk_engagement FOREIGN KEY (engagement_id) REFERENCES engagements(id) ON DELETE CASCADE
);

-- RLS (Row Level Security) - Enable data isolation per engagement
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Create indices for performance
CREATE INDEX idx_engagements_user ON engagements(created_by);
CREATE INDEX idx_working_papers_engagement ON working_papers(engagement_id);
CREATE INDEX idx_audit_trail_engagement ON audit_trail(engagement_id);
CREATE INDEX idx_issues_engagement ON issues(engagement_id);
```

---

## 2️⃣ ENVIRONMENT SETUP

### 2.1 Configure Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_AWS_REGION=eu-west-2
   VITE_AWS_ACCESS_KEY_ID=...
   VITE_AWS_SECRET_ACCESS_KEY=...
   VITE_AWS_S3_BUCKET=audit-engine-files
   ```

3. **IMPORTANT**: Add `.env.local` to `.gitignore` (already done)

### 2.2 Install Updated Dependencies

```bash
npm install
```

This will add:
- `@supabase/supabase-js` - Database client
- (Optional) `aws-sdk` - S3 file storage

---

## 3️⃣ SUPABASE CLIENT INTEGRATION

### 3.1 Create Supabase Client Module

Create `/src/lib/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export async function loadEngagement(engagementId) {
  const { data, error } = await supabase
    .from('engagements')
    .select('*')
    .eq('id', engagementId)
    .single();

  if (error) throw error;
  return data;
}

export async function saveEngagement(engagementId, engagementData) {
  const { data, error } = await supabase
    .from('engagements')
    .upsert({
      id: engagementId,
      ...engagementData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) throw error;
  return data;
}

export async function saveWorkingPaper(wpData) {
  const { data, error } = await supabase
    .from('working_papers')
    .upsert(wpData, { onConflict: 'id' });

  if (error) throw error;
  return data;
}

export async function logAuditTrail(engagement_id, action, details) {
  const { error } = await supabase
    .from('audit_trail')
    .insert({
      engagement_id,
      action,
      ...details,
      changed_at: new Date().toISOString()
    });

  if (error) console.error('Audit trail log failed:', error);
}
```

### 3.2 Integrate with AuditEngine.jsx

Update `src/AuditEngine.jsx` to add save functionality:

```javascript
import { supabase, saveEngagement, logAuditTrail } from './lib/supabaseClient';

// In your updateEngagement handler, add:
const handleEngagementUpdate = async (updatedData) => {
  updateEngagement(updatedData);

  // Sync to Supabase
  try {
    await saveEngagement(engagement.id, updatedData);
    await logAuditTrail(engagement.id, 'update', {
      table_name: 'engagements',
      new_values: updatedData
    });
  } catch (error) {
    console.error('Save failed:', error);
    // Show error toast to user
  }
};
```

---

## 4️⃣ AWS S3 FILE STORAGE (Optional)

### 4.1 Configure AWS S3

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Create new S3 bucket:
   - **Name**: `audit-engine-files-[your-org]`
   - **Region**: EU-West-2
   - **Block Public Access**: Enable
3. Create IAM user with S3 access:
   - Policy: `AmazonS3FullAccess`
   - Generate access key and secret

### 4.2 Upload Working Papers to S3

Create `/src/lib/s3Client.js`:

```javascript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: import.meta.env.VITE_AWS_REGION
});

export async function uploadWorkingPaper(engagementId, fileName, fileData) {
  const params = {
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
    Key: `${engagementId}/${fileName}`,
    Body: fileData,
    ContentType: 'application/pdf'
  };

  return s3.upload(params).promise();
}

export async function listWorkingPapers(engagementId) {
  const params = {
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
    Prefix: `${engagementId}/`
  };

  return s3.listObjectsV2(params).promise();
}
```

---

## 5️⃣ VERCEL DEPLOYMENT

### 5.1 Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Phase 2 infrastructure (Supabase, S3, Vercel config)"
   git push -u origin claude/setup-e-audit-project-RfaM3
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Select your GitHub repository
5. Configure environment variables:
   - Add all values from `.env.example`
6. Deploy

Your application will be live at: `https://your-project.vercel.app`

---

## 6️⃣ TESTING PHASE 2 FEATURES

### 6.1 Test Supabase Sync

```bash
npm run dev
```

1. Create new engagement in UI
2. Check Supabase dashboard → `engagements` table
3. Verify data appears in real-time

### 6.2 Test Audit Trail

1. Modify an engagement field
2. Check Supabase → `audit_trail` table
3. Verify action is logged with timestamp

### 6.3 Test File Upload (if S3 configured)

1. Export working papers
2. Verify files upload to S3
3. Check S3 console for file presence

---

## 📊 Phase 2 Completion Checklist

- [ ] Supabase project created and configured
- [ ] Database tables created with SQL
- [ ] Supabase client integration in code
- [ ] Environment variables configured locally
- [ ] Engagement data persisting to database
- [ ] Audit trail logging working
- [ ] AWS S3 configured (optional but recommended)
- [ ] File uploads to S3 working
- [ ] Vercel deployment configured
- [ ] Application live at production URL
- [ ] Team member access configured
- [ ] Backup and recovery plan documented

---

## 🔒 Security Checklist

- [ ] `.env.local` never committed to git
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] API keys rotated (change both Supabase and AWS keys quarterly)
- [ ] Database backups enabled (Supabase → Settings → Backups)
- [ ] HTTPS enabled on Vercel (automatic)
- [ ] S3 bucket versioning enabled
- [ ] Audit trail immutable (no delete permissions)

---

## 📞 Support & Next Steps

**After Phase 2 is complete:**
1. Run end-to-end testing with sample audit engagement
2. Train team on system usage
3. Proceed to Phase 3: Claude API integration for intelligent report generation

**Phase 3 Tasks:**
- Implement Claude API for automated finding summaries
- Add KAM (Key Audit Matters) suggestion engine
- Build disclosure compliance checker
- Create intelligent risk assessment based on industry benchmarks

---

**Last Updated**: 13-Mar-2026
**Version**: 1.0.0
**Status**: Ready for Implementation
