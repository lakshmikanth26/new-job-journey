# 📎 File Uploads Feature - NEW!

## ✨ What's New

You can now **attach files to tasks**! Perfect for:
- 📸 Screenshots of code/concepts
- 📄 PDFs of articles or tutorials
- 📝 Study notes (DOC, TXT)
- 📊 Diagrams and flowcharts

---

## 🎯 How to Use

### 1. Edit Any Task

1. Go to Dashboard or Daily Tasks
2. Find any task
3. Click **"Add notes & files"** button at the bottom of task card

### 2. Add Notes

- Write your learnings
- Add key points
- Document approaches
- Store important info

### 3. Upload Files

- Click **"Click to upload"**
- Select image, PDF, DOC, etc.
- Multiple files supported
- Max 10MB per file

### 4. View Attachments

- Files appear as icons on task card
- Click to view/download
- Delete if no longer needed
- Notes shown in yellow box

---

## 📁 Supported Files

**Images:**
- JPG, JPEG, PNG, GIF, WebP
- Thumbnail preview shown

**Documents:**
- PDF (📄)
- Word - DOC, DOCX (📝)
- Excel - XLS, XLSX (📊)
- PowerPoint - PPT, PPTX (📊)
- Text - TXT (📃)

**Max Size:** 10MB per file

---

## 🚀 Setup Required

### For Full Functionality:

1. **Run SQL Schema** (if not done already)
   - Adds `attachments` column to tasks table
   - See `SUPABASE_SETUP.md`

2. **Create Storage Bucket** (for file uploads)
   - Go to Supabase → Storage
   - Create bucket: `career-compass` (public)
   - See `STORAGE_SETUP.md`

### Without Setup:

- Notes work via localStorage ✅
- File upload button appears
- Uploads will fail (shows error message)
- All other features work fine

---

## 💡 Use Cases

### DSA Problems
```
Task: "Solve Two Sum"
Notes: "Use HashMap. TC: O(n), SC: O(n)"
Files: screenshot-solution.png, approach-notes.pdf
```

### SAP BTP Learning
```
Task: "Learn CAP Basics"
Notes: "CAP = Cloud Application Programming model"
Files: cap-architecture.png, notes-from-opensap.pdf
```

### System Design
```
Task: "Design Order Management"
Notes: "Microservices + Event-driven architecture"
Files: system-diagram.png, scalability-notes.docx
```

### Interview Prep
```
Task: "Mock Interview Practice"
Notes: "Practice common questions, STAR method"
Files: questions-list.pdf, my-answers.docx
```

---

## 🎨 UI Features

### Task Card Shows:

**Without attachments:**
```
[✓] Task Title
Description here...
[DSA] 
🔗 Reference Link
➕ Add notes & files
```

**With notes:**
```
[✓] Task Title
Description here...
[DSA]
📄 "Use HashMap approach..."
➕ Edit notes & files
```

**With attachments:**
```
[✓] Task Title
Description here...
[DSA]
📄 "Use HashMap approach..."
📎 2 attachments 📄 🖼️
✏️ Edit notes & files
```

---

## 🔧 Technical Details

### How It Works

1. **Upload:** File → Supabase Storage → Get URL
2. **Save:** URL stored in task `attachments` array
3. **Display:** URL rendered as downloadable link/preview
4. **Delete:** Removes URL from array + deletes from storage

### Storage Structure

```
Supabase Storage
└── career-compass/
    └── task-attachments/
        ├── 1729123456-abc123.jpg
        ├── 1729234567-def456.pdf
        └── 1729345678-ghi789.docx
```

### Data Structure

```typescript
interface TaskCompletion {
  [key: string]: {
    completed: boolean;
    referenceLink?: string;
    notes?: string;            // NEW!
    attachments?: string[];    // NEW!
  };
}
```

---

## 📊 Storage Limits

**Free Tier (Supabase):**
- 1GB total storage
- 50MB max file size (app enforces 10MB)
- 2GB bandwidth/month

**For 30-day prep:**
- ~1000 PDFs or ~5000 images
- More than enough! 🎯

---

## 🎯 Best Practices

### 1. Organize As You Learn
- Add notes immediately after learning
- Upload screenshots while fresh
- Attach PDFs you find useful

### 2. Quick Revision
- Notes visible on task card
- Click file to open
- No need to search elsewhere

### 3. Interview Prep
- Review all notes in Revision Hub
- Access attached materials
- Everything in one place!

### 4. Keep It Clean
- Delete unused attachments
- Keep notes concise
- Use reference links for web resources

---

## 🔜 Future Enhancements

Potential features:
- [ ] Drag & drop file upload
- [ ] File preview modal
- [ ] Search within notes
- [ ] Export all notes as PDF
- [ ] Notion integration
- [ ] Voice notes
- [ ] Collaborative editing

---

## 📝 Example Workflow

### Day 5: Spring Boot CRUD API

1. **Start Task**
   - Read task description
   - Open IDE and start coding

2. **While Working**
   - Click "Add notes & files"
   - Notes: "Created User entity, REST endpoints /api/users"
   - Upload: `crud-api-code.png`, `postman-tests.png`

3. **After Completion**
   - Mark task complete ✅
   - Task card now shows notes + 2 files

4. **Before Interview**
   - Go to Revision Hub
   - See this task
   - Click to read notes
   - View screenshots
   - Refresh memory! 🧠

---

## ✅ Summary

**What You Can Do:**
- ✅ Add notes to any task
- ✅ Upload images and documents
- ✅ View attachments anytime
- ✅ Edit/delete files
- ✅ Quick revision before interviews

**Setup Steps:**
1. Run SQL schema (adds `attachments` column)
2. Create Supabase Storage bucket (for uploads)
3. Done! Start adding files 🎉

**Optional:**
- Skip storage setup if you don't need uploads
- Notes still work via localStorage
- App functions normally without it

---

**Ready to enhance your learning?** Start adding notes and files to your tasks! 📚

See:
- `STORAGE_SETUP.md` - Detailed storage setup
- `SUPABASE_SETUP.md` - Database setup


