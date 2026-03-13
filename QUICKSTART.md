# ⚡ AuditEngine Quick Start (5 Minutes)

Get AuditEngine running immediately on your machine.

---

## 🎯 Prerequisites

Before you start, ensure you have:
- **Node.js**: Version 16 or later ([download](https://nodejs.org))
- **npm**: Version 8 or later (comes with Node.js)
- **Git**: For cloning (optional - can download ZIP)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

---

## 📦 Installation (2 minutes)

### 1. Get the Code
```bash
# Option A: Clone from git
git clone http://127.0.0.1:41331/git/buledidk/Audit-Automation-Engine.git
cd Audit-Automation-Engine

# Option B: Download as ZIP
# Unzip and navigate to the folder
cd Audit-Automation-Engine
```

### 2. Install Dependencies
```bash
npm install
# ⏱️ This takes 1-2 minutes first time
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

**Done! 🎉 System is now running.**

---

## 🔍 Your First Audit (3 minutes)

### Phase 1: Planning
1. **Entity Details**
   - Entity Name: `TestCorp Limited`
   - Industry: `Technology`
   - Framework: `FRS 102`
   - Financial Year End: `31 Dec 2025`

2. **Materiality**
   - Profit Before Tax: `£500,000`
   - Overall Materiality (5%): `£25,000`
   - Click **"Set Materiality"**

3. **Team**
   - Partner: `Jane Smith`
   - Manager: `John Doe`
   - Click **"Set Team"**

4. **Next**: Click **"Complete Planning & Advance"**

### Phase 2: Risk Assessment
1. Select each risk area (10 minutes to see how it works)
2. Adjust scores on 1-5 scale
3. Complete fraud risk assessment
4. Click **"Complete Risk Assessment & Advance"**

### Phase 3: Interim (Control Testing)
1. Review control effectiveness %
2. Change "Not Effective" to "Effective" for some controls
3. Click tabs: Design Effectiveness → Operating Effectiveness → Assessment
4. Click **"Complete Interim & Advance"**

### Phase 4: Final Audit
1. Click on FSLI areas (C1, D3, D4, etc.)
2. Review testing procedures
3. Add notes in Working Paper Notes
4. Mark some as Complete
5. Click **"Complete Final Audit & Advance"**

### Phase 5: Completion
1. Review Going Concern conclusion
2. Verify subsequent events
3. Check disclosures
4. Get Management Representations
5. Click **"Complete Completion & Advance"**

### Phase 6: Reporting
1. Review Audit Opinion
2. Check Key Audit Matters
3. View Management Letter
4. Click **"Issue Final Audit Report"**

### 📤 Export Results
1. Click **"Results Dashboard"** tab at top
2. Scroll down to **"Export Engagement"**
3. Choose format:
   - **Excel**: Multi-sheet professional report
   - **Word**: Formatted audit summary
   - **CSV**: Data for analysis

**That's it! You've completed a full audit lifecycle.** 🎓

---

## 📊 Dashboard Features (2 minutes)

While running, explore:

1. **Phase Progress** (Left sidebar)
   - Visual progress % per phase
   - Current phase highlighted
   - Total completion %

2. **Results Dashboard**
   - Click "Results" tab at top
   - See real-time KPIs:
     - Materiality utilization
     - Risk assessment scores
     - Control effectiveness %
     - FSLI testing progress
     - Issues/misstatements

3. **Working Papers** (Embedded in each phase)
   - Status: Pending → In Progress → Complete
   - Sign-off tracking
   - Notes and documentation

---

## 🎨 Interface Guide

### Left Sidebar
```
┌─────────────────────┐
│  AUDIT ENGINE       │ ← Project name
├─────────────────────┤
│ Entity: TestCorp    │ ← Your company
│ FYE: 31 Dec 2025    │
│ Status: Phase 3     │ ← Current phase
├─────────────────────┤
│ ► Planning (100%)   │ ← Click to jump
│ ► Risk (80%)        │
│ ► Interim (50%)     │
│ • Final (0%)        │ ← Current (bullet)
│ ○ Completion        │
│ ○ Reporting         │
└─────────────────────┘
```

### Top Navigation
```
[Phase View] [Results] [Export]
```
- **Phase View**: Edit audit data
- **Results**: See KPIs and progress
- **Export**: Download Excel/Word/CSV

---

## 🛠️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save (Phase 2 feature) |
| `Ctrl/Cmd + E` | Export |
| `Ctrl/Cmd + D` | Dashboard |
| `Arrow Up/Down` | Navigate phases |

---

## 💾 Data Management

### Local Storage (Current)
- ✅ All data saved in browser memory
- ✅ Persists while tab is open
- ⚠️ Clears when browser closes
- **Workaround**: Export to Excel before closing

### Persistent Storage (Phase 2)
After setting up Supabase:
- ✅ Data saved to PostgreSQL database
- ✅ Access from any device
- ✅ Team collaboration
- ✅ See [PHASE_2_SETUP.md](./PHASE_2_SETUP.md)

---

## 🐛 Troubleshooting

### Issue: "Port 5173 already in use"
```bash
# Kill the process using port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Then restart:
npm run dev
```

### Issue: "Module not found" errors
```bash
# Clear node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Browser shows blank page
1. Check browser console (F12)
2. Refresh page (Ctrl + R)
3. Clear browser cache (Ctrl + Shift + Delete)
4. Try different browser

### Issue: Slow performance
1. Close other browser tabs
2. Clear browser cache
3. Restart dev server: `Ctrl+C`, then `npm run dev`

---

## 📚 Documentation

| Document | For... |
|----------|--------|
| [README.md](./README.md) | Project overview & roadmap |
| [AUDIT_SYSTEM_DOCUMENTATION.md](./AUDIT_SYSTEM_DOCUMENTATION.md) | Complete audit lifecycle reference |
| [PHASE_2_SETUP.md](./PHASE_2_SETUP.md) | Database setup (Supabase) |
| [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) | Build status & deployment info |
| This file | Getting started (you are here) |

---

## 🚀 Next Steps

### Immediate (Today)
1. ✅ Run through sample audit (5 mins)
2. ✅ Explore Results Dashboard (2 mins)
3. ✅ Try exporting to Excel (1 min)
4. ✅ Review [AUDIT_SYSTEM_DOCUMENTATION.md](./AUDIT_SYSTEM_DOCUMENTATION.md) (10 mins)

### This Week
1. Test with your real engagement data
2. Customize materiality and team
3. Verify phase gating works
4. Export results and review format

### Next Week (Phase 2)
1. Follow [PHASE_2_SETUP.md](./PHASE_2_SETUP.md) for database setup
2. Set up Supabase (free tier available)
3. Configure environment variables
4. Deploy to Vercel (free tier available)

### Advanced Usage
1. Integrate with your audit methodology
2. Customize working papers per engagement
3. Add team members (Phase 2+)
4. Build automated reports (Phase 3)

---

## 💡 Tips & Tricks

### Save Time with Keyboard Navigation
- Use **Tab** to move between fields
- Use **Arrow Keys** to select phases
- Use **Enter** to confirm and advance

### Quick Data Entry
- Copy data from Excel/spreadsheets
- Paste directly into tables
- Use **Ctrl+Z** to undo mistakes (where available)

### Export Best Practices
1. Complete all phases first
2. Export to Excel for archival
3. Share Word export with team
4. Use CSV for data analysis

### Team Collaboration (Phase 2+)
- Share single engagement URL with team
- Real-time updates when Phase 2 is active
- Each user gets audit trail tracking
- Comments and notes per working paper

---

## 🎓 Learning Resources

### For Audit Professionals
- ISA mappings: See [AUDIT_SYSTEM_DOCUMENTATION.md](./AUDIT_SYSTEM_DOCUMENTATION.md), section "🎯 6-PHASE AUDIT LIFECYCLE"
- Working papers: Section "📊 RESULTS DASHBOARD"
- Phase gating: Section "💡 KEY FEATURES"

### For Developers
- React component structure: `src/AuditEngine.jsx`
- Phase components: `src/phases/`
- State management: `src/store/engagementStore.js`
- Build config: `vite.config.js`

---

## ❓ FAQ

**Q: Can multiple people use it at once?**
A: Phase 1 (current): No, one person per browser. Phase 2: Yes, with database integration.

**Q: Is my data safe?**
A: Phase 1: Only on your computer. Phase 2: Encrypted in Supabase database.

**Q: Can I use this for real audits?**
A: Yes! It implements ISA 200-700 standards. See compliance checklist in [README.md](./README.md).

**Q: How much does it cost?**
A: Free to use. Phase 2 (database): Supabase free tier available. Vercel free tier available.

**Q: Can I add custom fields?**
A: Currently: No, working papers are fixed. Phase 2+: Yes, with database flexibility.

**Q: How do I backup my data?**
A: Phase 1: Export to Excel regularly. Phase 2: Automatic backups via Supabase.

**Q: Can I integrate with other tools?**
A: Phase 1: Via export (Excel/CSV). Phase 2: API integration possible. Phase 3: Claude AI integration planned.

---

## 🆘 Need Help?

1. **Check the docs** → [README.md](./README.md)
2. **Review audit guide** → [AUDIT_SYSTEM_DOCUMENTATION.md](./AUDIT_SYSTEM_DOCUMENTATION.md)
3. **Deployment help** → [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
4. **Setup issues** → [PHASE_2_SETUP.md](./PHASE_2_SETUP.md)
5. **Browser console** → Press `F12`, check Console tab for errors

---

## 🎯 Success Checklist

After quick start, you should have:
- [ ] System running on localhost:5173
- [ ] Completed all 6 audit phases
- [ ] Exported to Excel/Word
- [ ] Reviewed Results Dashboard
- [ ] Explored working papers
- [ ] Understood phase gating
- [ ] Reviewed compliance features
- [ ] Planned next steps

**Congratulations! You're ready to audit.** 🚀

---

**Ready?** Start with: `npm run dev`

**Version**: 1.0.0-Live
**Last Updated**: 13-Mar-2026
