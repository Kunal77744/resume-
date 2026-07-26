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

## Implementation

The site uses plain HTML, CSS, and JavaScript with no build step or application
framework. The interface includes semantic page landmarks, a keyboard skip link,
visible focus styles, responsive layouts, and reduced-motion support.

PostHog records page views and contact-link clicks. Autocapture and session
recording are disabled, and the contact event contains only the email contact
method, the link location (`hero` or `footer`), and an optional allowlisted,
non-personal evaluator route. Tagged evaluator visits also carry the same route
label into the pre-addressed email draft; arbitrary query values are ignored.

## View locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
