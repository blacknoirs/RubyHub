# Script Hub

Static website (no build step, no dependencies). Works on GitHub Pages.

## Put it online
1. Create a GitHub repo and upload everything in this folder to the root (keep the `.nojekyll` file).
2. Repo Settings > Pages > "Deploy from a branch" > `main` / `/ (root)` > Save.
3. Your site appears at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

## Customise
- Add or edit scripts, site name and Discord link in `scripts.js`.
- Host your `.lua` files in the same repo and point each `loadstring` at the raw URL:
  `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/yourscript.lua`

## Before launch
Search `terms.html` and `privacy.html` for `[` and fill in every bracketed placeholder
([DATE], [YOUR NAME OR HANDLE], [CONTACT EMAIL], [YOUR COUNTRY / STATE]).
Have a lawyer review the legal pages.
