# Class Inspector

Static browser-based inspector for likely class typos in HTML, JSX/TSX and Vue markup, with optional CSS/JavaScript context and ZIP uploads. Designed for GitHub Pages; no backend, login or API key required.

## Features

- Paste HTML, CSS and JavaScript into separate editor tabs.
- Automatically check against the combined Bootstrap 3, 4 and 5 rule sets; no version selection required.
- ZIP project inspection (HTML, CSS, JS, JSX, TSX, Vue; local ZIP extraction).
- Detect likely class-name typos using built-in Bootstrap rules and supplied CSS selectors.
- Show file/line/column, suggestions and readable details.
- Manually apply suggestions to the in-browser HTML draft, or export a JSON report.
- Light/dark theme, responsive UI.

## Run locally

ES modules require an HTTP server (do not open the file directly):

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Deploy to GitHub Pages

1. Create a GitHub repository named `class-inspector` and push the entire project to its `main` branch.
2. Open repository **Settings → Pages** and select **GitHub Actions** for the build/deployment source.
3. Push to `main` (or run the `Deploy GitHub Pages` workflow manually).
4. Open `https://YOUR_USERNAME.github.io/class-inspector/`.

The app uses relative URLs, so it works beneath a GitHub Pages repository path.

## Security and limitations

- Scanning runs in your browser. Uploaded files are not sent to GitHub or a server.
- ZIP files are capped at 15 MB compressed, 10 MB total extracted supported source, 500 matching files and 1 MB per individual source file; excluded common build folders are ignored.
- The scanner analyzes **static** class references only and does not execute uploaded JavaScript.
- External stylesheets, imported CSS, dynamically generated class names and framework plugins may lead to unknown-class messages or missed issues.
- `Warning` and `Note` are intentionally non-definitive. Even a high-confidence typo should be reviewed before applying.
- ZIP scan is read-only; applying changes is limited to the editor's HTML draft. The report contains excerpts/class names, so review it before sharing.
- No URL scanning, site crawling, Playwright, AI integration or guaranteed missing-class detection in v1.

## Code layout

- `index.html` — application shell.
- `styles.css` — complete responsive design system.
- `src/scanner.js` — static inspection logic.
- `src/main.js` — editor, ZIP, results, fixes and UI events.
- `vendor/jszip.min.js` — JSZip distribution for local ZIP parsing.
- `.github/workflows/deploy.yml` — Pages deployment workflow.

## Dependency note

JSZip is distributed under MIT license. Its bundled license is in `vendor/JSZIP-LICENSE.txt`. The app deliberately has no npm build step so it can be audited and deployed on static hosting without package installation.

Note: Bootstrap validation uses a bundled heuristic rule set, not full official CSS inventories. A class that exists in any supported version is accepted; this does not prove compatibility with a particular version.
