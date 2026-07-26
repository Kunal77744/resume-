# Kunal Deshmukh portfolio

A single-page MERN and full-stack development portfolio for Kunal Deshmukh. The
live site is available at
[resume-sable-phi.vercel.app](https://resume-sable-phi.vercel.app/).

## Selected projects

The portfolio presents three public projects from Kunal's existing portfolio:

- **EcoTrace** is a MERN carbon emission tracker with authentication, CRUD
  flows, dashboards, and data visualization.
- **Bookify** is a MERN bookstore with inventory, user, order, search, filter,
  and cart flows.
- **AI Study Buddy** is a Streamlit and Gemini-powered study companion.

It also includes **Signal Desk**, a self-initiated interactive interface study.
Visitors can choose a priority by pointer or keyboard and see the selected
state, progress, timing, and live feedback update.

## Implementation

The site uses plain HTML, CSS, and JavaScript with no build step or application
framework. The interface includes semantic page landmarks, a keyboard skip link,
visible focus styles, responsive layouts, and reduced-motion support. The
homepage also links to a one-page downloadable resume built from the same
verified project, education, skill, and credential details.

PostHog records page views, contact-link clicks, contact-address copies, Signal
Desk priority changes, and resume-download clicks. Autocapture and session
recording are disabled.
Contact events contain only the email method, link location (`hero` or
`footer`), and an optional allowlisted, non-personal evaluator route. Resume
events contain only the link location and the same optional route. Signal Desk
events contain only the selected priority, input method, and the same optional
route. Copy events contain only the contact location. Tagged evaluator visits
also carry that route into the pre-addressed email draft; arbitrary query values
are ignored.

## View locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
