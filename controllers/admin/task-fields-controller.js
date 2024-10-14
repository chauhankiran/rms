const taskFieldsService = require("../../services/admin/task-fields-service");

module.exports = {
  addTaskFieldsInSession: async (req) => {
    try {
      const taskFields = await taskFieldsService.addTaskFieldsInSession();

      let sessionTaskFields = {};
      for (const taskField of taskFields) {
        sessionTaskFields[taskField.name] = taskField.displayName;
      }
      req.session.taskFields = sessionTaskFields;
    } catch (err) {
      next(err);
    }
  },
};
