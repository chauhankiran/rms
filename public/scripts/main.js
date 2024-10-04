const dropdown = document.querySelector(".dropdown");
dropdown &&
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

function deleteUser() {
  if (confirm("Are you sure you want to delete this user?")) {
    document.deleteUserForm.submit();
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

function deleteContact() {
  if (confirm("Are you sure you want to delete this contact?")) {
    document.deleteContactForm.submit();
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

  if (
    confirm(`Are you sure you want to de-active ${count} selected user(s)?`)
  ) {
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
