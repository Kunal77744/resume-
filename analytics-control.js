(function (root, factory) {
  const analyticsControl = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = analyticsControl;
    return;
  }

  root.PortfolioAnalytics = analyticsControl;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function isEnabled(search = "") {
    const query = new URLSearchParams(search);

    return !query.getAll("analytics").includes("off");
  }

  return {
    isEnabled,
  };
});
