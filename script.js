const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const finePointerQuery = window.matchMedia("(pointer: fine)");
const motionRoot = document.documentElement;
const scrollProgress = document.querySelector("[data-scroll-progress]");
const ambientSpotlight = document.querySelector("[data-ambient-spotlight]");

const markMotionTargets = () => {
  const loadTargets = [
    [".site-header", "header", 0],
    [".hero .status-line, .case-hero .status-line", "content", 20],
    [".hero h1, .case-hero h1", "content", 55],
    [".hero-intro, .case-hero-intro", "content", 85],
    [".hero-actions, .case-hero-actions", "content", 115],
    [".profile-panel, .case-hero-visual", "content", 70],
  ];

  loadTargets.forEach(([selector, kind, delay]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.dataset.load = kind;
      element.style.setProperty("--motion-delay", `${delay}ms`);
    });
  });

  const revealGroups = [
    ".proof-strip > div",
    ".section-heading > *",
    ".project > .project-art",
    ".project > .project-copy",
    ".signal-desk",
    ".skill-groups > article",
    ".timeline > li",
    ".credential-grid > article",
    ".contact > div",
    ".case-section > *",
    ".source-proof",
  ];

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = "";
      element.style.setProperty(
        "--motion-delay",
        `${Math.min(index % 3, 2) * 45}ms`,
      );
    });
  });
};

const initMotion = () => {
  markMotionTargets();
  motionRoot.classList.add("motion-ready");

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      motionRoot.classList.add("motion-entered");
    });
  });

  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
};

if (!reducedMotionQuery.matches) {
  initMotion();
}

const updateScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0
      ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
      : 0;

  scrollProgress.style.transform = `scaleX(${progress})`;
};

let scrollFrame;
window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
      updateScrollProgress();
      scrollFrame = null;
    });
  },
  { passive: true },
);
updateScrollProgress();

if (
  ambientSpotlight &&
  finePointerQuery.matches &&
  !reducedMotionQuery.matches
) {
  const spotlightSize = 420;
  let spotlightFrame;
  let pointerX = -spotlightSize;
  let pointerY = -spotlightSize;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX - spotlightSize / 2;
      pointerY = event.clientY - spotlightSize / 2;
      motionRoot.classList.add("has-pointer");

      if (spotlightFrame) {
        return;
      }

      spotlightFrame = window.requestAnimationFrame(() => {
        ambientSpotlight.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
        spotlightFrame = null;
      });
    },
    { passive: true },
  );

  document.documentElement.addEventListener("mouseleave", () => {
    motionRoot.classList.remove("has-pointer");
  });
}

const navigationLinks = Array.from(
  document.querySelectorAll('.site-header nav a[href^="#"]'),
);

if ("IntersectionObserver" in window && navigationLinks.length) {
  const sectionLinks = new Map(
    navigationLinks
      .map((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        return target ? [target, link] : null;
      })
      .filter(Boolean),
  );

  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      navigationLinks.forEach((link) => {
        const isCurrent = link === sectionLinks.get(visibleEntry.target);
        link.classList.toggle("is-current", isCurrent);

        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-22% 0px -62% 0px",
      threshold: [0, 0.1, 0.25],
    },
  );

  sectionLinks.forEach((link, section) => {
    navigationObserver.observe(section);
  });
}

const evaluatorSource =
  window.PortfolioAttribution?.getAllowedSource(window.location.search) ?? null;

if (evaluatorSource) {
  document
    .querySelectorAll('a[href^="mailto:"][data-contact-location]')
    .forEach((contactLink) => {
      contactLink.href = window.PortfolioAttribution.addSourceToMailto(
        contactLink.href,
        evaluatorSource,
      );
    });
}

const signalDesk = document.querySelector("[data-signal-desk]");

if (signalDesk) {
  const priorityButtons = Array.from(
    signalDesk.querySelectorAll("[data-signal-priority]"),
  );
  const focusTitle = signalDesk.querySelector("[data-signal-focus-title]");
  const focusTime = signalDesk.querySelector("[data-signal-focus-time]");
  const feedback = signalDesk.querySelector("[data-signal-feedback]");
  const progress = signalDesk.querySelector("[data-signal-progress]");
  const progressBar = progress?.closest('[role="progressbar"]');

  priorityButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button.getAttribute("aria-pressed") === "true") {
        return;
      }

      const priority = button.dataset.signalPriority;
      const title = button.dataset.signalTitle;
      const time = button.dataset.signalTime;
      const progressValue = Number(button.dataset.signalProgressValue);

      if (
        !priority ||
        !title ||
        !time ||
        !Number.isFinite(progressValue) ||
        !focusTitle ||
        !focusTime ||
        !feedback ||
        !progress ||
        !progressBar
      ) {
        return;
      }

      priorityButtons.forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-pressed", String(isActive));

        const status = candidate.querySelector("[data-signal-task-status]");
        if (status) {
          status.textContent = isActive ? "In focus" : "Set priority";
        }
      });

      focusTitle.textContent = title;
      focusTime.textContent = time;
      feedback.textContent = `${title} is now the priority.`;
      progress.style.width = `${progressValue}%`;
      progressBar.setAttribute("aria-valuenow", String(progressValue));

      if (typeof window.posthog?.capture === "function") {
        const interactionProperties = {
          selected_priority: priority,
          interaction_method: event.detail === 0 ? "keyboard" : "pointer",
        };

        if (evaluatorSource) {
          interactionProperties.evaluator_source = evaluatorSource;
        }

        window.posthog.capture(
          "signal_desk_priority_changed",
          interactionProperties,
        );
      }
    });
  });
}

const copyEmailButton = document.querySelector("[data-copy-email]");
const contactEmail = document.querySelector("[data-contact-email]");
const copyEmailLabel = copyEmailButton?.querySelector("[data-copy-label]");
const copyEmailStatus = document.querySelector("#contact-copy-status");
let copyStatusResetTimer;

const selectContactEmail = () => {
  if (!contactEmail) {
    return;
  }

  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(contactEmail);
  selection?.removeAllRanges();
  selection?.addRange(range);
  contactEmail.focus();
};

const copyWithLegacyFallback = (text) => {
  const copyField = document.createElement("textarea");

  copyField.value = text;
  copyField.setAttribute("readonly", "");
  copyField.style.position = "fixed";
  copyField.style.opacity = "0";
  document.body.append(copyField);
  copyField.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  copyField.remove();
  return copied;
};

if (
  copyEmailButton &&
  contactEmail &&
  copyEmailLabel &&
  copyEmailStatus
) {
  copyEmailButton.addEventListener("click", async () => {
    const emailAddress = contactEmail.textContent?.trim();

    if (!emailAddress) {
      return;
    }

    let copied = false;

    try {
      if (typeof navigator.clipboard?.writeText !== "function") {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(emailAddress);
      copied = true;
    } catch {
      copied = copyWithLegacyFallback(emailAddress);
    }

    window.clearTimeout(copyStatusResetTimer);

    if (!copied) {
      selectContactEmail();
      copyEmailLabel.textContent = "Selected";
      copyEmailButton.dataset.copyState = "selected";
      copyEmailStatus.textContent =
        "Copy unavailable. The email address is selected for manual copying.";
      return;
    }

    copyEmailLabel.textContent = "Copied";
    copyEmailButton.dataset.copyState = "copied";
    copyEmailStatus.textContent = "Email address copied to clipboard.";

    if (typeof window.posthog?.capture === "function") {
      window.posthog.capture("contact_copied", {
        contact_location: copyEmailButton.dataset.copyLocation,
      });
    }

    copyStatusResetTimer = window.setTimeout(() => {
      copyEmailLabel.textContent = "Copy email";
      delete copyEmailButton.dataset.copyState;
      copyEmailStatus.textContent =
        "Select the address manually if copying is unavailable.";
    }, 3000);
  });
}

document.addEventListener("click", (event) => {
  const resumeLink =
    event.target instanceof Element
      ? event.target.closest("[data-resume-download]")
      : null;

  if (resumeLink && typeof window.posthog?.capture === "function") {
    const resumeProperties = {
      download_location: "hero",
    };

    if (evaluatorSource) {
      resumeProperties.evaluator_source = evaluatorSource;
    }

    window.posthog.capture("resume_download_clicked", resumeProperties);
  }

  const contactLink =
    event.target instanceof Element
      ? event.target.closest('a[href^="mailto:"]')
      : null;

  if (!contactLink || typeof window.posthog?.capture !== "function") {
    return;
  }

  const contactLocation = contactLink.dataset.contactLocation;

  if (
    contactLocation !== "hero" &&
    contactLocation !== "footer" &&
    contactLocation !== "case-study"
  ) {
    return;
  }

  const contactProperties = {
    contact_method: "email",
    contact_location: contactLocation,
  };

  if (evaluatorSource) {
    contactProperties.evaluator_source = evaluatorSource;
  }

  window.posthog.capture("contact_clicked", contactProperties);
});
