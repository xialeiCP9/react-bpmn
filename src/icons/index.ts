const req = require.context("./svg", false, /\.svg$/);

const requireAll = (requireContext: typeof req) => requireContext.keys().map(requireContext);

requireAll(req);