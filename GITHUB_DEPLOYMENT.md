# 🚀 Pushing GearGuard to GitHub

## Step 1: Initialize Git (if not already done)
```bash
git init
```

## Step 2: Add All Files
```bash
git add .
```

## Step 3: Create Initial Commit
```bash
git commit -m "Initial commit: GearGuard - Complete Maintenance Tracker with RBAC"
```

## Step 4: Add Remote Repository
```bash
git remote add origin https://github.com/tejppatil/Gear_Guard.git
```

## Step 5: Set Main Branch
```bash
git branch -M main
```

## Step 6: Push to GitHub
```bash
git push -u origin main
```

---

## ⚠️ Important Notes

### If Repository Already Exists on GitHub
If the repository already has content, you may need to pull first:
```bash
git pull origin main --allow-unrelated-histories
```
Then push:
```bash
git push -u origin main
```

### If You Get Authentication Errors
You may need to authenticate with GitHub:
- **Personal Access Token**: Use a GitHub Personal Access Token instead of password
- **SSH**: Set up SSH keys for authentication

### Create .gitignore (Recommended)
Make sure you have a `.gitignore` file to exclude:
- `node_modules/`
- `.next/`
- `.env.local`
- `gearguard-data.json` (optional - if you want to exclude local data)

---

## 📋 Quick Command Sequence
Copy and paste these commands one by one:

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: GearGuard - Complete Maintenance Tracker with RBAC"

# Add remote
git remote add origin https://github.com/tejppatil/Gear_Guard.git

# Set branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ✅ After Pushing
Your project will be live at:
**https://github.com/tejppatil/Gear_Guard**

You can then:
- Add a README.md with project description
- Set up GitHub Actions for CI/CD
- Enable GitHub Pages for documentation
- Invite collaborators
