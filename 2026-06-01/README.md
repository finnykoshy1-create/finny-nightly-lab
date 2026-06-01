# Family Council Builder

## What it does
Family Council Builder is a simple offline web app that helps you run a **25-minute weekly family council** with a clear structure:
- prayer + scripture anchor,
- top 3 family outcomes,
- marriage/kids/store/health checkpoints,
- prompted warm conversation,
- and an if-then finish trigger for follow-through.

It can save/load your last plan in local browser storage, copy a ready-to-send text version, and export a `.ics` calendar event.

## Why this helps Finny
- **Family leadership consistency:** one repeatable format you can run even on busy weeks.
- **Faith-first rhythm:** starts with scripture and prayer, not logistics.
- **Execution + completion:** built-in finish trigger reinforces “finish what I start.”
- **Covers real-life domains:** marriage, kids discipleship, Tropical Hut operations, and health in one view.
- **Low friction:** runs fully local, no accounts/API keys.

## How to use in under 5 minutes
1. Open terminal in this folder:
   ```bash
   cd /Users/Finny/.hermes/finny-nightly-lab/2026-06-01
   ```
2. Start a local web server:
   ```bash
   python3 -m http.server 8766
   ```
3. Open in browser:
   - `http://127.0.0.1:8766`
4. Fill fields and click **Generate Council Plan**.
5. Optional:
   - **Save Locally / Load Last** for repeat use,
   - **Copy as Text** for notes/chat,
   - **Download .ics Calendar Event** to place on calendar.

## Verification executed
```bash
python3 -m http.server 8766
curl -I http://127.0.0.1:8766
curl -I http://127.0.0.1:8766/app.js
```
Result: local server responded `HTTP/1.0 200 OK` for both page and script.
