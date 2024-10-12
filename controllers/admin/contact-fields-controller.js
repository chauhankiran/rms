const contactFieldsService = require("../../services/admin/contact-fields-service");

module.exports = {
  addContactFieldsInSession: async (req) => {
    try {
      const contactFields =
        await contactFieldsService.addContactFieldsInSession();

      let sessionContactFields = {};
      for (const contactField of contactFields) {
        sessionContactFields[contactField.name] = contactField.displayName;
      }
      req.session.contactFields = sessionContactFields;
    } catch (err) {
      next(err);
    }
  },
};
