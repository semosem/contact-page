# Contact Page

Matrix-inspired personal contact page with interactive slider, terminal, ambient rain, and a small performance HUD.

## Run Locally

Use any static server. Examples:

```bash
# Python
python3 -m http.server

# Node
npx serve .
```

Then visit `http://localhost:8000` (or the port your server prints).

## Structure

- `index.html` – markup
- `styles.css` – visual styling and animations (dev source)
- `styles.min.css` – production/minified stylesheet (used on master)
- `js/app.js` – app entry point
- `js/data.js` – copy and slider content
- `js/matrix.js` – matrix rain + glitch
- `js/modules/` – UI pieces (slider, audio, gauges, CV, terminal, perf)

## Notes

- Slider: visual intensity ramps to the right; top tier flashes `CALL NOW!`.
- Audio: toggle via the speaker button; autoplay is gated by user gesture/slider threshold.
- Performance HUD: FPS/frame/load dials; non-blocking, decorative.
- Idle mode: ambient motion pauses after inactivity to save cycles.

## Branch Workflow

- Develop on `development`.
- On merge to `master`, use the minified CSS (`styles.min.css`) for production.
