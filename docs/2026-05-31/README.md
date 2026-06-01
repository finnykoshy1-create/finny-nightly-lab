# Tropical Hut Daily Rhythm Card

## What it does
A lightweight local web app that creates a single **Daily Rhythm Card** combining:
- spiritual focus (prayer + scripture anchor),
- top store priorities for Tropical Hut,
- delegation + inventory watch,
- family leadership action,
- health non-negotiable,
- and a finish-what-I-start trigger.

It can save/load locally in browser storage and copy a clean text version for quick sharing in notes/chat.

## Why this helps Finny
- **Reduces decision fatigue** by giving one compact daily planning ritual.
- **Improves follow-through** by making top 3 outcomes explicit.
- **Supports family + faith consistency** in the same execution system.
- **Helps Tropical Hut operations** with recurring inventory/delegation visibility.
- **Runs fully offline** with no keys, accounts, or external services.

## How to use (under 5 minutes)
1. Open terminal in this folder:
   ```bash
   cd /Users/Finny/.hermes/finny-nightly-lab/2026-05-31
   ```
2. Start a local static server:
   ```bash
   python3 -m http.server 8765
   ```
3. Open in browser:
   - `http://127.0.0.1:8765`
4. Fill the fields and click **Generate Card**.
5. Optional:
   - **Save Locally**: stores latest card in browser localStorage.
   - **Load Last**: restores last saved card.
   - **Copy as Text**: copies card summary for notes/messages.

## Verification run
Smoke-tested by launching a local server and requesting the page:
```bash
python3 -m http.server 8765
curl -I http://127.0.0.1:8765
```
Expected result: HTTP 200 from local server.
