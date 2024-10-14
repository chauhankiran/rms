const ticketFieldsService = require("../../services/admin/ticket-fields-service");

module.exports = {
  addTicketFieldsInSession: async (req) => {
    try {
      const ticketFields = await ticketFieldsService.addTicketFieldsInSession();

      let sessionTicketFields = {};
      for (const ticketField of ticketFields) {
        sessionTicketFields[ticketField.name] = ticketField.displayName;
      }
      req.session.ticketFields = sessionTicketFields;
    } catch (err) {
      next(err);
    }
  },
};
