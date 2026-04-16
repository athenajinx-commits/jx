# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML showcase repository containing two self-contained pages:
- **`merit/index.html`** — MERIT landing page ("Live Well. Earn Forward.")
- **`azure-confluent-private-link.html`** — Educational guide on Azure + Confluent Cloud Private Link networking

There is no build system, package manager, or test suite. Both files are standalone HTML with embedded CSS and can be opened directly in a browser.

## Development

To preview locally, serve with any static file server:
```bash
python -m http.server 8000
```

Then open `http://localhost:8000/merit/` or `http://localhost:8000/azure-confluent-private-link.html`.

## Design System

**MERIT (`merit/index.html`):**
- Fonts: Playfair Display, DM Sans, DM Mono (via Google Fonts)
- Palette: cream, charcoal, sage, gold, rust (defined as CSS custom properties)

**Azure Confluent guide (`azure-confluent-private-link.html`):**
- Gradient theme: `#667eea` → `#764ba2` (purple)
- Self-contained styling with hover effects and concept boxes

## Git Branch

Active development branch: `claude/check-system-status-UNMSM`
