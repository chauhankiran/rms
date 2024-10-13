const dealFieldsService = require("../../services/admin/deal-fields-service");

module.exports = {
  addDealFieldsInSession: async (req) => {
    try {
      const dealFields = await dealFieldsService.addDealFieldsInSession();

      let sessionDealFields = {};
      for (const dealField of dealFields) {
        sessionDealFields[dealField.name] = dealField.displayName;
      }
      req.session.dealFields = sessionDealFields;
    } catch (err) {
      next(err);
    }
  },
};
