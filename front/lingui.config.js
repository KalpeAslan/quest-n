const { formatter } = require("@lingui/format-po");

module.exports = {
  locales: ["en", "uk", "ru"],
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: formatter({ explicitIdAsDefault: true }),
};
