# FitTrack Pro

A professional fitness and health tracking website built with **HTML**, **CSS**, and **JavaScript**. FitTrack Pro helps users monitor workouts, BMI, daily water intake, and calorie goals — all from a modern, responsive interface with a red-and-black fitness theme.

![FitTrack Pro](images/features/workout.jpg)

---

## Features

| Module | Description |
|--------|-------------|
| **Home** | Full-screen hero carousel, programs carousel, animated statistics, feature cards, testimonials, and CTA section |
| **Workout Tracker** | Add, view, and delete workouts; data persisted in browser localStorage |
| **BMI Calculator** | Calculate Body Mass Index from weight (kg) and height (cm) with visual category scale |
| **Water Intake** | Track daily glasses of water with progress bar; auto-resets each day |
| **Calorie Goal** | Set a daily calorie target, log meals, and view consumed/remaining calories |
| **Contact** | Contact form with validation and success feedback |

---

## Tech Stack

- **HTML5** — Semantic markup, ARIA attributes, accessible forms
- **CSS3** — Custom properties, Grid/Flexbox, responsive breakpoints, animations
- **JavaScript (ES6+)** — Vanilla JS, no frameworks; localStorage for client-side persistence
- **Google Fonts** — Bebas Neue (display) + Inter (body)

---

## Project Structure

```
fitness-tracker/
├── index.html          # Homepage
├── workout.html        # Workout tracker
├── bmi.html            # BMI calculator
├── water.html          # Water intake tracker
├── calories.html       # Calorie goal tracker
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # All application logic
├── images/
│   └── features/       # Local feature card images
│       ├── workout.jpg
│       ├── bmi.jpg
│       └── water.jpg
├── README.md           # This file
└── TECHNICAL_REPORT.md # Technical report (2 pages)
```

---

## Getting Started

No build step or server is required. Open any HTML file directly in a browser:

1. Clone or download this repository
2. Open `index.html` in Chrome, Firefox, Edge, or Safari
3. Navigate using the top menu to explore all trackers

> **Tip:** For the best experience, use a local development server (e.g. VS Code Live Server) to avoid any browser restrictions on local file access.

---

## Data Storage

All tracker data is stored in the browser's **localStorage**:

| Key | Purpose |
|-----|---------|
| `fittrack_workouts` | Saved workout entries |
| `fittrack_water` | Daily water glass count |
| `fittrack_water_date` | Last water tracking date |
| `fittrack_calorie_goal` | Daily calorie target |
| `fittrack_calorie_meals` | Logged meals for today |
| `fittrack_calorie_date` | Last calorie tracking date |

Data stays on the user's device and is not sent to any server.

---

## Design

- **Theme:** Red (`#e50914`) and black (`#0d0d0d`) fitness aesthetic
- **Layout:** Responsive design with breakpoints at 1024px, 768px, and 480px
- **Interactivity:** Hero carousel, programs carousel, scroll-reveal animations, animated counters, mobile navigation

---

## Documentation

- **[TECHNICAL_REPORT.docx](TECHNICAL_REPORT.docx)** — Technical report (Word, ~2 pages): problem-solving approach, accessibility/security, performance optimization
- **[TECHNICAL_REPORT.md](TECHNICAL_REPORT.md)** — Same report in Markdown format

To regenerate the Word file: `python generate_report.py`

---

## Author

**FitTrack Pro** — 2026  
Contact: shaheer.73907@iqra.edu.pk | +92 3343619549 | Karachi, Pakistan

---

## License

This project was built as an academic/portfolio fitness tracker application.
