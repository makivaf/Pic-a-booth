# 🎀 Pic-a-Booth

A **kawaii-themed browser photobooth** that lets you take 1–4 photos, pick a cute strip template, and download your finished photo strip — no installs, no server, just open and shoot.

---

## ✨ Features

- **1 to 4 photos per strip** — choose before you shoot
- **6 cute strip themes** — Sakura, Candy, Cotton, Dreamy, Mint, Midnight
- **Countdown timer** — 3s, 5s, or 10s between each shot
- **Strip theme picker** — appears after all photos are taken
- **Retake option** — reshoot without refreshing the page
- **Downloadable photo strip** — saved as a PNG with your chosen theme
- **Kawaii UI** — floating hearts & stars, bouncy animations, pastel palette
- **Custom Canva template support** — drop in your own PNG backgrounds

---

## 🚀 How to Run

No build step or server needed.

1. Download or clone the project folder
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari)
3. Allow camera access when prompted
4. Start snapping! 📸

> **Note:** Camera access requires either `localhost` or an `https://` connection. Opening the file directly from your desktop (`file://`) may block camera access in some browsers. If that happens, use a simple local server — e.g. run `npx serve .` inside the project folder.

---


## 📦 Dependencies

All loaded via CDN — no npm install needed.

| Library | Version | Purpose |
|---------|---------|---------|
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.6.0 | Confetti burst after last photo |
| [Google Fonts — Poppins](https://fonts.google.com/specimen/Poppins) | — | UI font |
| [Google Fonts — Comic Neue](https://fonts.google.com/specimen/Comic+Neue) | — | Kawaii label font |
