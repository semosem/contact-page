# Contact Page

Matrix-inspired personal contact page with interactive slider, terminal, and ambient effects.

## Run Locally

This project uses native ES modules, so open it with a local web server.

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Structure

- `index.html` – markup
- `styles.css` – visual styling and animations
- `js/main.js` – app entry point
- `js/ui.js` – UI logic (slider, terminal, CV, sound)
- `js/matrix.js` – matrix rain + glitch
- `js/data.js` – shared constants

## Notes

- The slider intentionally escalates visual intensity toward the right end.
- At the max value, the main text becomes `CALL NOW!` and flashes.
- Ambient audio is a synthetic "matrix hum" toggled by the sound button.
- The slider HUD shows signal percentage and mode.
