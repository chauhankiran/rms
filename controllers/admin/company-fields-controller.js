const companyFieldsService = require("../../services/admin/company-fields-service");

module.exports = {
  addCompanyFieldsInSession: async (req) => {
    try {
      const companyFields =
        await companyFieldsService.addCompanyFieldsInSession();

      let sessionCompanyFields = {};
      for (const companyField of companyFields) {
        sessionCompanyFields[companyField.name] = companyField.displayName;
      }
      req.session.companyFields = sessionCompanyFields;
    } catch (err) {
      next(err);
    }
  },
};
