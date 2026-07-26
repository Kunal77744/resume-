# Kunal Deshmukh portfolio

A single-page web design and development portfolio for Kunal Deshmukh. The live
site is available at
[resume-sable-phi.vercel.app](https://resume-sable-phi.vercel.app/).

## Interface studies

The portfolio presents three self-initiated concept studies. They are interface
explorations, not client work:

- **Signal Desk** explores prioritisation and calm information density in an
  interactive productivity dashboard. Visitors can change the current priority
  with a pointer or keyboard and see immediate status feedback.
- **Field Notes** explores editorial pacing and long-form browsing in a research
  library.
- **Common Ground** explores mobile-first storytelling and progressive detail
  for a community event.

## Implementation

The site uses plain HTML, CSS, and JavaScript with no build step or application
framework. The interface includes semantic page landmarks, a keyboard skip link,
visible focus styles, responsive layouts, and reduced-motion support.

PostHog records page views, contact-link clicks, and Signal Desk priority
changes. Autocapture and session recording are disabled. The Signal Desk event
contains only the selected concept priority, the input method (`keyboard` or
`pointer`), and an optional allowlisted, non-personal evaluator route. Contact
events contain only the email contact method, link location (`hero` or
`footer`), and the same optional route. Tagged evaluator visits also carry the
route label into the pre-addressed email draft; arbitrary values are ignored.

## View locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
