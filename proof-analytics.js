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
    "ecotrace-walkthrough",
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
  const allowedProofDetails = new Map([
    ["case-study", new Set(["ecotrace", "bookify", "ai-study-buddy"])],
    ["technical-walkthrough", new Set(["ecotrace"])],
    ["pinned-source", new Set(["ecotrace", "bookify", "ai-study-buddy"])],
  ]);

  function getEvaluatorProperties(evaluatorSource) {
    return allowedEvaluatorSources.has(evaluatorSource)
      ? { evaluator_source: evaluatorSource }
      : {};
  }

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

  function captureProjectProofHubView({
    proofSurface,
    evaluatorSource,
    posthog,
    documentRoot,
  }) {
    if (
      proofSurface !== "project-proof" ||
      typeof posthog?.capture !== "function" ||
      !documentRoot?.dataset ||
      documentRoot.dataset.projectProofHubViewCaptured === "true"
    ) {
      return false;
    }

    documentRoot.dataset.projectProofHubViewCaptured = "true";
    posthog.capture(
      "project_proof_hub_viewed",
      getEvaluatorProperties(evaluatorSource),
    );
    return true;
  }

  function getProofDetailProperties(detailType, project, evaluatorSource) {
    if (!allowedProofDetails.get(detailType)?.has(project)) {
      return null;
    }

    return {
      detail_type: detailType,
      project,
      ...getEvaluatorProperties(evaluatorSource),
    };
  }

  function captureProofDetailClick({ target, evaluatorSource, posthog }) {
    if (
      typeof target?.closest !== "function" ||
      typeof posthog?.capture !== "function"
    ) {
      return false;
    }

    const detailLink = target.closest("[data-proof-detail]");
    const properties = getProofDetailProperties(
      detailLink?.dataset?.proofDetail,
      detailLink?.dataset?.proofProject,
      evaluatorSource,
    );

    if (!properties) {
      return false;
    }

    posthog.capture("proof_detail_clicked", properties);
    return true;
  }

  return {
    captureProjectProofHubView,
    captureProofDetailClick,
    captureProofView,
    getProofDetailProperties,
    getProofViewProperties,
  };
});
