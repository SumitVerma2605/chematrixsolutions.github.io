# ChemiCLSES Website

Official website for **ChemiCLSES** — CFD Simulation, Process Optimization & Software Development.

## Files

```
index.html   ← Main HTML (single page)
style.css    ← Stylesheet
script.js    ← Animations, interactions, form handling
README.md    ← This file
```

---

## Hosting on GitHub Pages (www.chemiclses.com)

### Step 1 — Create the repository

1. Go to [github.com](https://github.com) and sign in.
2. Create a new repository named exactly: `chemiclses.github.io`  
   *(or any name if you'll use a custom domain)*
3. Set it to **Public**.

### Step 2 — Upload files

Either via the GitHub web interface (drag & drop) or via terminal:

```bash
git init
git add .
git commit -m "Initial website launch"
git remote add origin https://github.com/YOUR_USERNAME/chemiclses.github.io.git
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under *Source*, select **Deploy from a branch** → `main` / `root`
3. Click **Save**

Your site will be live at `https://YOUR_USERNAME.github.io` within a few minutes.

### Step 4 — Connect custom domain (www.chemiclses.com)

**In GitHub:**
1. Settings → Pages → *Custom domain*
2. Enter: `www.chemiclses.com`
3. Click Save — this creates a `CNAME` file in the repo automatically.
4. Check **Enforce HTTPS** once DNS propagates.

**In your DNS provider (domain registrar):**

Add these records:

| Type  | Host  | Value                    |
|-------|-------|--------------------------|
| A     | @     | 185.199.108.153          |
| A     | @     | 185.199.109.153          |
| A     | @     | 185.199.110.153          |
| A     | @     | 185.199.111.153          |
| CNAME | www   | YOUR_USERNAME.github.io  |

DNS propagation typically takes 10–30 minutes (up to 48 hours).

---

## Contact Form Setup

The contact form currently simulates submission. To make it functional, replace the `setTimeout` in `script.js` with one of:

- **[Formspree](https://formspree.io)** — Free, simple, no backend needed
- **[EmailJS](https://emailjs.com)** — Send email directly from the browser
- Your own backend API endpoint

---

## Customization

| What to change | Where |
|---|---|
| Company info, text | `index.html` |
| Colors, fonts | `:root` variables in `style.css` |
| Services / capabilities | `index.html` service cards section |
| Contact email | `index.html` contact details + `script.js` |
| Particle animation speed | `PARTICLE_COUNT`, `STREAM_COUNT` in `script.js` |
