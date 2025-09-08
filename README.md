# Firebase Studio

This is a NextJS starter in Firebase Studio.

---

## How to Push to a **New** GitHub Repository

Follow these steps to connect and push your project to a newly created repository on GitHub.

**1. Initialize the local repository (You've already done this!)**
```bash
git init -b main
```

**2. Add all files to Git tracking**
```bash
git add .
```

**3. Save your changes (Initial Commit)**
```bash
git commit -m "Initial commit for Carisma Connect project"
```

**4. Connect your project to the GitHub repository**
**Important:** Copy the URL of your **new** repository from GitHub and replace it in the command below.
```bash
git remote add origin https://github.com/your-user/your-new-repository.git
```

**5. Push the code and set up tracking**
This is the final and most important step. The `push` command sends your files, and the `-u` (or `--set-upstream`) flag sets up the permanent connection between your local branch and the one on GitHub.
```bash
git push -u origin main
```

---
### For Day-to-Day Updates

After the initial setup, use only these three commands to send your new changes:

**1. Stage the changes**
```bash
git add .
```

**2. Save the changes**
```bash
git commit -m "Describe your changes here"
```

**3. Push to GitHub**
```bash
git push
```

---
## Common Troubleshooting

### Error: `remote origin already exists`
**What it means:** You tried to connect (`add`) your project, but it's already connected to another repository.

**How to fix:** Instead of adding, **update** the URL of the existing `origin` with the `set-url` command.
```bash
# Replace with the URL of your NEW repository
git remote set-url origin https://github.com/your-user/your-new-repository.git
```
After that, try the `git push` again.

### Error: `[rejected] (fetch first)` or `(non-fast-forward)`
**What it means:** The repository on GitHub has changes (like an initial README) that your computer doesn't have. You need to download those changes before you can push yours.

**How to fix:** Use `git pull --rebase` to download the remote changes and place yours on top.
```bash
# 1. Pull the changes from GitHub
git pull origin main --rebase

# 2. Now push your changes
git push
```