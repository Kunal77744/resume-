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
