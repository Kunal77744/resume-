# Kunal Deshmukh | MERN / Full Stack Developer

I turn ideas into working products. This repository supports my public portfolio
with three source-backed projects across MERN applications, backend pipelines,
and practical AI tools.

**[Review all three projects in one proof summary](https://resume-sable-phi.vercel.app/project-proof/?ref=portfolio-story)**

The proof summary pairs each project with its case study, reviewed source, and
current limits. It documents implemented behavior, not users, business outcomes,
production scale, or client work.

## Three public projects

### EcoTrace

A TypeScript MERN carbon-emission tracker that turns an activity note into an
estimated emissions breakdown, then stores and returns that record for the
authenticated account. Integration tests cover authentication, validation,
calculation, history, and deletion with the external AI call replaced.

Current limit: the result is an estimate, not an environmental audit. A
deterministic keyword fallback keeps development flows testable without Gemini.

- [Read the case study](https://resume-sable-phi.vercel.app/projects/ecotrace/)
- [Read the technical walkthrough](https://resume-sable-phi.vercel.app/projects/ecotrace/technical-walkthrough/)
- Inspect the reviewed revision through the
  [calculator view](https://github.com/mern2026book-cmd/CarbonEmission/blob/c6b7bd8ec37be2f346d9fba3e92ea3837febe23a/frontend/src/pages/Calculator.tsx),
  [footprint controller](https://github.com/mern2026book-cmd/CarbonEmission/blob/c6b7bd8ec37be2f346d9fba3e92ea3837febe23a/backend/src/controllers/footprint.controller.ts),
  and [API tests](https://github.com/mern2026book-cmd/CarbonEmission/blob/c6b7bd8ec37be2f346d9fba3e92ea3837febe23a/backend/tests/footprint.test.ts).
- [Browse the full reviewed source](https://github.com/mern2026book-cmd/CarbonEmission/tree/c6b7bd8ec37be2f346d9fba3e92ea3837febe23a)

### Bookify

A JavaScript MERN bookstore prototype that loads a catalog, filters titles and
free books in the browser, exposes signup and login endpoints, and keeps a
duplicate-free cart in browser storage.

Current limit: the client points to a localhost API. The reviewed source has no
server-validated session, connected checkout, public working demo, or app-level
test suite.

- [Read the case study](https://resume-sable-phi.vercel.app/projects/bookify/)
- Inspect the reviewed revision through the
  [catalog search](https://github.com/Kunal77744/Shopify/blob/fd6be2878de3eab19bcfedd706d749ddfc11c7ed/Frontend/src/components/Course.jsx),
  [cart state](https://github.com/Kunal77744/Shopify/blob/fd6be2878de3eab19bcfedd706d749ddfc11c7ed/Frontend/src/context/CartContext.jsx),
  and [account controller](https://github.com/Kunal77744/Shopify/blob/fd6be2878de3eab19bcfedd706d749ddfc11c7ed/Backend/controller/user.controller.js).
- [Browse the full reviewed source](https://github.com/Kunal77744/Shopify/tree/fd6be2878de3eab19bcfedd706d749ddfc11c7ed)

### AI Study Buddy

A Python and Streamlit capstone with five study surfaces: topic explanations,
document summaries, generated quizzes, focus planning, and architecture notes.
One shared gateway handles Gemini access and fallback request paths.

Current limit: model-backed features require a Gemini key, state lasts only for
the active Streamlit session, image-only PDFs have no OCR path, and the reviewed
source has no app-level tests.

- [Read the case study](https://resume-sable-phi.vercel.app/projects/ai-study-buddy/)
- Inspect the reviewed revision through the
  [file extraction flow](https://github.com/Kunal77744/AI-Study-Buddy/blob/06114d8669265f7270e1b15c854808b7ec482832/app.py#L161-L183),
  [Gemini gateway](https://github.com/Kunal77744/AI-Study-Buddy/blob/06114d8669265f7270e1b15c854808b7ec482832/app.py#L185-L224),
  and [quiz flow](https://github.com/Kunal77744/AI-Study-Buddy/blob/06114d8669265f7270e1b15c854808b7ec482832/app.py#L433-L535).
- [Browse the full reviewed source](https://github.com/Kunal77744/AI-Study-Buddy/tree/06114d8669265f7270e1b15c854808b7ec482832)

## Portfolio and resume

- [Open the live portfolio](https://resume-sable-phi.vercel.app/) for projects,
  experience, credentials, and the Signal Desk interaction study.
- [Download the one-page resume](https://resume-sable-phi.vercel.app/Kunal-Deshmukh-Full-Stack-Developer-Resume.pdf)
  for a portable summary of the same verified work.

## Portfolio implementation

The portfolio uses plain HTML, CSS, and JavaScript with no build step or
application framework. It includes semantic landmarks, a keyboard skip link,
visible focus styles, responsive layouts, and reduced-motion support. Signal
Desk is a self-initiated interaction study with pointer and keyboard behavior.

PostHog records page views and a small set of portfolio actions. Autocapture and
session recording are disabled. Events use allowlisted action details such as
contact location, input method, selected Signal Desk priority, and an optional
non-personal evaluator source. Email addresses, resume contents, task text, and
message contents are not sent in event payloads.

Production verification visits should add `?analytics=off` to the page URL.
That exact query value skips PostHog initialization and every manual event on
the page, keeping internal checks out of portfolio usage counts.

## View locally

From the repository root, start a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
