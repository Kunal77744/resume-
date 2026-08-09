(function (root, factory) {
  const analytics = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = analytics;
    return;
  }

  root.PortfolioProofAnalytics = analytics;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const allowedProofSurfaces = new Set([
    "ecotrace",
    "bookify",
    "ai-study-buddy",
    "mern-projects-guide",
    "hire-full-stack-developer",
    "project-proof",
  ]);
  const allowedEvaluatorSources = new Set([
    "hiring-review",
    "portfolio-story",
    "frontend-craft",
  ]);

  function getProofViewProperties(proofSurface, evaluatorSource) {
    if (!allowedProofSurfaces.has(proofSurface)) {
      return null;
    }

    const properties = {
      proof_surface: proofSurface,
    };

    if (allowedEvaluatorSources.has(evaluatorSource)) {
      properties.evaluator_source = evaluatorSource;
    }

    return properties;
  }

  function captureProofView({
    proofSurface,
    evaluatorSource,
    posthog,
    documentRoot,
  }) {
    const properties = getProofViewProperties(
      proofSurface,
      evaluatorSource,
    );

    if (
      !properties ||
      typeof posthog?.capture !== "function" ||
      !documentRoot?.dataset ||
      documentRoot.dataset.proofViewCaptured === "true"
    ) {
      return false;
    }

    documentRoot.dataset.proofViewCaptured = "true";
    posthog.capture("portfolio_proof_viewed", properties);
    return true;
  }

  return {
    captureProofView,
    getProofViewProperties,
  };
});
