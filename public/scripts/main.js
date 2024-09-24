const dropdown = document.querySelector(".dropdown");
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

function archiveUser() {
  if (confirm("Are you sure you want to change the user status?")) {
    document.archiveUserForm.submit();
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
  } else {
    return false;
  }
}
