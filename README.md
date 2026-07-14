# Tek Sophanith — Portfolio

A personal portfolio site for a Software Engineering student / Full Stack Developer.
Dark, glassmorphic, premium aesthetic. Built with plain HTML, CSS, and JS — no build step required.

## Folder structure

```
portfolio/
├── index.html          # Page markup (built section by section)
├── css/
│   └── style.css        # All styles — design tokens live at the top as CSS variables
├── js/
│   └── script.js         # Nav behavior, particle background, typing animation, etc.
├── assets/
│   ├── resume/
│   │   └── Tek-Sophanith-CV.pdf   ← put your real CV here (exact filename)
│   ├── images/
│   │   └── og-cover.jpg           ← put a 1200×630 social preview image here (optional)
│   └── icons/
│       └── favicon.svg
└── README.md
```

## Before you deploy

1. Drop your real resume PDF at `assets/resume/Tek-Sophanith-CV.pdf` (must match that exact name — the Download CV buttons link to it directly).
2. Replace the placeholder profile icon in the hero with a real photo (swap the `.profile-photo` SVG placeholder for an `<img>` once you have one).
3. Update the social links (`GitHub`, `LinkedIn`, `Telegram`, `Facebook`, email) in `index.html` with your real URLs — currently placeholders.
4. Update `og:url` / `canonical` in `<head>` once you have a real domain.
5. Add a real `assets/images/og-cover.jpg` (1200×630) for link previews on social media, or remove those two meta tags if you don't want one.

## Design tokens

All colors, fonts, radii, and easing curves are defined as CSS custom properties at the top of `css/style.css` under `:root`. Change a value once there and it updates everywhere — no duplicated styles across sections.

## Sections (built incrementally)

- [x] Part 1 — Hero
- [x] Part 2 — About
- [x] Part 3 — Skills
- [x] Part 4 — Projects
- [x] Part 5 — Experience & Education
- [x] Part 6 — Contact
- [x] Part 7 — Footer
