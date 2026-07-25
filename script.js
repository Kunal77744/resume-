const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
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

  window.posthog.capture("contact_clicked", {
    contact_method: "email",
    contact_location: contactLocation,
  });
});
