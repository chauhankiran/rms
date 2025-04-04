const dropdown = document.querySelector(".dropdown");
dropdown &&
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

/**
 * Company
 */
function activeCompany() {
  if (confirm("Are you sure you want to active this company?")) {
    document.activeCompanyForm.submit();
  } else {
    return false;
  }
}
function archiveCompany() {
  if (confirm("Are you sure you want to archive this company?")) {
    document.archiveCompanyForm.submit();
  } else {
    return false;
  }
}
function deleteCompany() {
  if (confirm("Are you sure you want to delete this company?")) {
    document.deleteCompanyForm.submit();
  } else {
    return false;
  }
}

/**
 * Contact
 */
function activeContact() {
  if (confirm("Are you sure you want to active this contact?")) {
    document.activeContactForm.submit();
  } else {
    return false;
  }
}
function archiveContact() {
  if (confirm("Are you sure you want to archive this contact?")) {
    document.archiveContactForm.submit();
  } else {
    return false;
  }
}
function deleteContact() {
  if (confirm("Are you sure you want to delete this contact?")) {
    document.deleteContactForm.submit();
  } else {
    return false;
  }
}

/**
 * Deal
 */
function activeDeal() {
  if (confirm("Are you sure you want to active this deal?")) {
    document.activeDealForm.submit();
  } else {
    return false;
  }
}
function archiveDeal() {
  if (confirm("Are you sure you want to archive this deal?")) {
    document.archiveDealForm.submit();
  } else {
    return false;
  }
}
function deleteDeal() {
  if (confirm("Are you sure you want to delete this deal?")) {
    document.deleteDealForm.submit();
  } else {
    return false;
  }
}

/**
 * Quote
 */
function activeQuote() {
  if (confirm("Are you sure you want to active this quote?")) {
    document.activeQuoteForm.submit();
  } else {
    return false;
  }
}
function archiveQuote() {
  if (confirm("Are you sure you want to archive this quote?")) {
    document.archiveQuoteForm.submit();
  } else {
    return false;
  }
}
function deleteQuote() {
  if (confirm("Are you sure you want to delete this quote?")) {
    document.deleteQuoteForm.submit();
  } else {
    return false;
  }
}

/**
 * Ticket
 */
function activeTicket() {
  if (confirm("Are you sure you want to active this ticket?")) {
    document.activeTicketForm.submit();
  } else {
    return false;
  }
}
function archiveTicket() {
  if (confirm("Are you sure you want to archive this ticket?")) {
    document.archiveTicketForm.submit();
  } else {
    return false;
  }
}
function deleteTicket() {
  if (confirm("Are you sure you want to delete this ticket?")) {
    document.deleteTicketForm.submit();
  } else {
    return false;
  }
}

/**
 * Task
 */
function activeTask() {
  if (confirm("Are you sure you want to active this task?")) {
    document.activeTaskForm.submit();
  } else {
    return false;
  }
}
function archiveTask() {
  if (confirm("Are you sure you want to archive this task?")) {
    document.archiveTaskForm.submit();
  } else {
    return false;
  }
}
function deleteTask() {
  if (confirm("Are you sure you want to delete this task?")) {
    document.deleteTaskForm.submit();
  } else {
    return false;
  }
}

/**
 * User
 */

function deleteUser() {
  if (confirm("Are you sure you want to delete this user?")) {
    document.deleteUserForm.submit();
  } else {
    return false;
  }
}

function archiveUser() {
  if (confirm("Are you sure you want to change the user status?")) {
    document.archiveUserForm.submit();
  } else {
    return false;
  }
}

/**
 * Company source
 */
function activeCompanySource() {
  if (confirm("Are you sure you want to active company source?")) {
    document.activeCompanySourceForm.submit();
  } else {
    return false;
  }
}
function archiveCompanySource() {
  if (confirm("Are you sure you want to archive company source?")) {
    document.archiveCompanySourceForm.submit();
  } else {
    return false;
  }
}
function deleteCompanySource() {
  if (confirm("Are you sure you want to delete company source?")) {
    document.deleteCompanySourceForm.submit();
  } else {
    return false;
  }
}

/**
 * Contact industry
 */
function activeContactIndustry() {
  if (confirm("Are you sure you want to active contact industry?")) {
    document.activeContactIndustryForm.submit();
  } else {
    return false;
  }
}
function archiveContactIndustry() {
  if (confirm("Are you sure you want to archive contact industry?")) {
    document.archiveContactIndustryForm.submit();
  } else {
    return false;
  }
}
function deleteContactIndustry() {
  if (confirm("Are you sure you want to delete contact industry?")) {
    document.deleteContactIndustryForm.submit();
  } else {
    return false;
  }
}

/**
 * Deal source
 */
function activeDealSource() {
  if (confirm("Are you sure you want to active deal source?")) {
    document.activeDealSourceForm.submit();
  } else {
    return false;
  }
}
function archiveDealSource() {
  if (confirm("Are you sure you want to archive deal source?")) {
    document.archiveDealSourceForm.submit();
  } else {
    return false;
  }
}
function deleteDealSource() {
  if (confirm("Are you sure you want to delete deal source?")) {
    document.deleteDealSourceForm.submit();
  } else {
    return false;
  }
}

/**
 * Ticket type
 */
function activeTicketType() {
  if (confirm("Are you sure you want to active ticket type?")) {
    document.activeTicketTypeForm.submit();
  } else {
    return false;
  }
}
function archiveTicketType() {
  if (confirm("Are you sure you want to archive ticket type?")) {
    document.archiveTicketTypeForm.submit();
  } else {
    return false;
  }
}
function deleteTicketType() {
  if (confirm("Are you sure you want to delete ticket type?")) {
    document.deleteTicketTypeForm.submit();
  } else {
    return false;
  }
}

/**
 * Task type
 */
function activeTaskType() {
  if (confirm("Are you sure you want to active task type?")) {
    document.activeTaskTypeForm.submit();
  } else {
    return false;
  }
}
function archiveTaskType() {
  if (confirm("Are you sure you want to archive task type?")) {
    document.archiveTaskTypeForm.submit();
  } else {
    return false;
  }
}
function deleteTaskType() {
  if (confirm("Are you sure you want to delete task type?")) {
    document.deleteTaskTypeForm.submit();
  } else {
    return false;
  }
}

/**
 * Company label
 */
function activeCompanyLabel() {
  if (confirm("Are you sure you want to active this company label?")) {
    document.activeCompanyLabelForm.submit();
  } else {
    return false;
  }
}
function archiveCompanyLabel() {
  if (confirm("Are you sure you want to archive this company label?")) {
    document.archiveCompanyLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Contact label
 */
function activeContactLabel() {
  if (confirm("Are you sure you want to active this contact label?")) {
    document.activeContactLabelForm.submit();
  } else {
    return false;
  }
}
function archiveContactLabel() {
  if (confirm("Are you sure you want to archive this contact label?")) {
    document.archiveContactLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Deal label
 */
function activeDealLabel() {
  if (confirm("Are you sure you want to active this deal label?")) {
    document.activeDealLabelForm.submit();
  } else {
    return false;
  }
}
function archiveDealLabel() {
  if (confirm("Are you sure you want to archive this deal label?")) {
    document.archiveDealLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Quote label
 */
function activeQuoteLabel() {
  if (confirm("Are you sure you want to active this quote label?")) {
    document.activeQuoteLabelForm.submit();
  } else {
    return false;
  }
}
function archiveQuoteLabel() {
  if (confirm("Are you sure you want to archive this quote label?")) {
    document.archiveQuoteLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Ticket label
 */
function activeTicketLabel() {
  if (confirm("Are you sure you want to active this ticket label?")) {
    document.activeTicketLabelForm.submit();
  } else {
    return false;
  }
}
function archiveTicketLabel() {
  if (confirm("Are you sure you want to archive this ticket label?")) {
    document.archiveTicketLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Task label
 */
function activeTaskLabel() {
  if (confirm("Are you sure you want to active this task label?")) {
    document.activeTaskLabelForm.submit();
  } else {
    return false;
  }
}
function archiveTaskLabel() {
  if (confirm("Are you sure you want to archive this task label?")) {
    document.archiveTaskLabelForm.submit();
  } else {
    return false;
  }
}

/**
 * Module label
 */
function activeModuleLabel() {
  if (confirm("Are you sure you want to active this module label?")) {
    document.activeModuleLabelForm.submit();
  } else {
    return false;
  }
}
function archiveModuleLabel() {
  if (confirm("Are you sure you want to archive this module label?")) {
    document.archiveModuleLabelForm.submit();
  } else {
    return false;
  }
}

function activeMultipleUsers() {
  const checkboxes = document.querySelectorAll("input[name='userId']:checked");
  const selectedUserIds = [];

  checkboxes.forEach((checkbox) => {
    selectedUserIds.push(checkbox.value);
  });

  const count = selectedUserIds.length;

  if (count === 0) {
    alert("Please select user(s) first.");
    return;
  }

  if (confirm(`Are you sure you want to active ${count} selected user(s)?`)) {
    document.querySelector("#toActiveUserIds").value = selectedUserIds;
    document.massUserActiveForm.submit();
  } else {
    return false;
  }
}

function deActiveMultipleUsers() {
  const checkboxes = document.querySelectorAll("input[name='userId']:checked");
  const selectedUserIds = [];

  checkboxes.forEach((checkbox) => {
    selectedUserIds.push(checkbox.value);
  });

  const count = selectedUserIds.length;

  if (count === 0) {
    alert("Please select user(s) first.");
    return;
  }

  if (confirm(`Are you sure you want to archived ${count} selected user(s)?`)) {
    document.querySelector("#toDeActiveUserIds").value = selectedUserIds;
    document.massUserDeActiveForm.submit();
  } else {
    return false;
  }
}

function deleteMultipleUsers() {
  const checkboxes = document.querySelectorAll("input[name='userId']:checked");
  const selectedUserIds = [];

  checkboxes.forEach((checkbox) => {
    selectedUserIds.push(checkbox.value);
  });

  const count = selectedUserIds.length;

  if (count === 0) {
    alert("Please select user(s) first.");
    return;
  }

  if (confirm(`Are you sure you want to delete ${count} selected user(s)?`)) {
    document.querySelector("#deleteUserIds").value = selectedUserIds;
    document.massDeleteUsersForm.submit();
  } else {
    return false;
  }
}
