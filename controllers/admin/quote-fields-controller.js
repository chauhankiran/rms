const quoteFieldsService = require("../../services/admin/quote-fields-service");

module.exports = {
  addQuoteFieldsInSession: async (req) => {
    try {
      const quoteFields = await quoteFieldsService.addQuoteFieldsInSession();

      let sessionQuoteFields = {};
      for (const quoteField of quoteFields) {
        sessionQuoteFields[quoteField.name] = quoteField.displayName;
      }
      req.session.quoteFields = sessionQuoteFields;
    } catch (err) {
      next(err);
    }
  },
};
