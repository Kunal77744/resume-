const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
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

document.addEventListener("click", (event) => {
  const contactLink =
    event.target instanceof Element
      ? event.target.closest('a[href^="mailto:"]')
      : null;

  if (!contactLink || typeof window.posthog?.capture !== "function") {
    return;
  }

  const contactLocation = contactLink.dataset.contactLocation;

  if (contactLocation !== "hero" && contactLocation !== "footer") {
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
