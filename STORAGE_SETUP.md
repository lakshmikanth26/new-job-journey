# 📁 Supabase Storage Setup for File Uploads

Quick guide to enable file uploads (images, PDFs, documents) in Career Compass.

## 🎯 What This Enables

Once set up, you can:
- ✅ Upload images to tasks
- ✅ Attach PDFs and documents
- ✅ View/download attachments
- ✅ Store files in Supabase cloud storage

**Supported Files:**
- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Max file size: 10MB per file

---

## 🚀 Setup (3 minutes)

### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
   ```
   https://app.supabase.com/project/mrykshinqyowgexuniev
   ```

2. **Navigate to Storage**
   - Click **Storage** in left sidebar
   - Click **"New bucket"** button

3. **Create Bucket**
   - **Name:** `job-docs` (exactly this name)
   - **Public bucket:** Toggle **ON** (make it public)
   - Click **"Create bucket"**
   
   ✅ **Already done!** You've created the `job-docs` bucket.

### Step 2: Set Storage Policies

1. **Click on your bucket**
   - Click `job-docs` bucket in the list

2. **Create Policy**
   - Click **"New policy"** button
   - Click **"For full customization"**

3. **Allow All Operations**
   - **Policy name:** `Allow all operations`
   - **Allowed operation:** Select all (SELECT, INSERT, UPDATE, DELETE)
   - **Target roles:** public
   - **USING expression:** `true`
   - Click **"Review"** then **"Save policy"**

That's it! File uploads will now work. ✅

---

## 🧪 Test File Upload

1. **Open your app**
   ```
   http://localhost:3000
   ```

2. **Go to any task**
   - Click "Add notes & files"

3. **Upload a file**
   - Click "Click to upload"
   - Select an image or PDF
   - Wait for upload
   - You should see the file appear!

4. **Verify in Supabase**
   - Go to Supabase → Storage → job-docs
   - You should see your uploaded file in `task-attachments/` folder

---

## 📖 How It Works

### Upload Process
1. User clicks "Upload" in task edit modal
2. File is validated (type & size)
3. File uploads to Supabase Storage bucket
4. Public URL is generated
5. URL saved to task `attachments` array
6. File appears in task card

### File Organization
```
job-docs/
└── task-attachments/
    ├── 1729123456789-abc123.jpg
    ├── 1729123456790-def456.pdf
    └── 1729123456791-ghi789.docx
```

Files are named with timestamp + random ID to avoid conflicts.

---

## 💾 Without Storage (Fallback)

If you skip this setup:
- App still works fine ✅
- File upload button appears
- But uploads will fail gracefully
- You'll see: "Using localStorage fallback"
- All other features work normally

The app is designed to work with or without Supabase Storage!

---

## 🔐 Security (Optional)

### Basic Setup (Current)
- Public bucket with open policies
- Anyone with URL can access files
- Good for personal use

### Secure Setup (Advanced)
For production or private files:

```sql
-- Restrict to authenticated users only
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'job-docs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view" ON storage.objects
FOR SELECT USING (
  bucket_id = 'job-docs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'job-docs' AND
  auth.uid() = owner
);
```

This requires adding authentication (NextAuth) later.

---

## 📊 Storage Limits (Free Tier)

Supabase Free Tier includes:
- ✅ **1GB total storage**
- ✅ **50MB max file size**
- ✅ **2GB bandwidth/month**

For this app (personal use):
- **1GB = ~1000 PDFs or 5000 images**
- More than enough for 30 days of prep! 🎯

---

## 🎨 File Type Icons

The app automatically shows icons for files:
- 📄 PDF
- 📝 Word documents
- 📊 Excel spreadsheets
- 🖼️ Images (with preview)
- 📎 Other files

---

## ⚙️ Advanced: Custom Bucket Settings

In Supabase Storage → job-docs → Settings:

**File size limit:**
- Default: 50MB (Supabase max)
- App enforces: 10MB (change in `lib/storage.ts`)

**Allowed MIME types:**
- Default: All types
- App validates: Images, PDF, Office docs only

**Cache Control:**
- Set to: 3600 seconds (1 hour)
- Files cached for faster loading

---

## 🔧 Troubleshooting

### Upload fails with "Storage not configured"
**Solution:** Check that:
1. Bucket named exactly `job-docs`
2. Bucket is public
3. Policies allow all operations
4. Restart dev server

### "File type not supported"
**Allowed types:**
- Images: jpg, jpeg, png, gif, webp
- PDF: pdf
- Word: doc, docx
- Excel: xls, xlsx
- PowerPoint: ppt, pptx
- Text: txt

### "File too large"
**Max size:** 10MB per file
- Reduce image quality
- Compress PDF
- Split large files

### Can't see uploaded files
**Check:**
1. Go to Supabase → Storage → job-docs
2. Look in `task-attachments/` folder
3. Files should be there
4. Click file to get public URL

---

## 📚 Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [Upload Files Tutorial](https://supabase.com/docs/guides/storage/uploads)

---

## ✅ Setup Complete!

You now have:
- ✅ Storage bucket created
- ✅ Policies configured
- ✅ File uploads enabled
- ✅ Images and docs attached to tasks

**Start uploading!** 📎

Add screenshots, notes, PDFs, or any study materials to your tasks. Perfect for keeping everything organized during your 30-day prep! 🎯

---

**Optional:** If you don't want file uploads, you can skip this entire setup. The app works great without it! All other features remain fully functional.

