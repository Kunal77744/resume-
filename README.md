# Kunal Deshmukh portfolio

A single-page web design and development portfolio for Kunal Deshmukh. The live
site is available at
[resume-sable-phi.vercel.app](https://resume-sable-phi.vercel.app/).

## Interface studies

The portfolio presents three self-initiated concept studies. They are interface
explorations, not client work:

- **Signal Desk** explores prioritisation and calm information density in a
  productivity dashboard.
- **Field Notes** explores editorial pacing and long-form browsing in a research
  library.
- **Common Ground** explores mobile-first storytelling and progressive detail
  for a community event.

## Implementation

The site uses plain HTML, CSS, and JavaScript with no build step or application
framework. The interface includes semantic page landmarks, a keyboard skip link,
visible focus styles, responsive layouts, and reduced-motion support.

PostHog records page views and contact-link clicks. Autocapture and session
recording are disabled, and the contact event contains only the email contact
method and the link location (`hero` or `footer`).

## View locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
