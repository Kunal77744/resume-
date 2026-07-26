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
