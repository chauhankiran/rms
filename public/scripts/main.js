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
