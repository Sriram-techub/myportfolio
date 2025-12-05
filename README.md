# Portfolio Website (Static)

This is a simple, responsive static portfolio website scaffold. It includes sections for Home, About, Skills, Certifications, Experiences and Contact.

Quick start

- Open `index.html` directly in a browser (double-click) OR run a lightweight local server.

Run a local server (recommended) using Python from PowerShell:

```powershell
# from the project folder d:\Documents\myportfolio
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Customization

- Edit `index.html` to change text, add projects, or replace placeholders.
- Update `css/style.css` for typography, colors, or layout tweaks.
- Enhance `js/main.js` to integrate a backend, analytics, or form submission API.

Auto-filled content

- This repository was auto-filled from `sriram.docx` found in the project folder. Sections updated: About, Skills, Projects, Certifications, Internships/Experiences, and Contact.
- A resume placeholder was added at `assets/resume.pdf`. Replace it with your real resume PDF to enable the downloadable Resume link.

Contact form

- The contact form still uses a `mailto:` fallback by default (opens the user's mail client). Replace `js/main.js` form handler with a serverless endpoint or API to accept messages.

Theme (Dark / Light)

- This site now supports a Dark/Light theme toggle in the header. The theme is persisted in `localStorage` and respects the user's `prefers-color-scheme` setting by default.
- To customize colors, edit CSS variables in `css/style.css` under `:root` (light) and `:root[data-theme="dark"]` (dark overrides).

Deploy

- This can be deployed as a static site on GitHub Pages, Netlify, Vercel, or any static host.

Notes

- The contact form uses a `mailto:` fallback for demo purposes. Replace it with an API call or serverless function for production.
- Accessibility: header navigation supports focus outlines and aria attributes. Test with screen readers and keyboard navigation.
