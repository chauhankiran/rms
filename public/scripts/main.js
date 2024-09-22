function deleteUser() {
  if (confirm("Are you sure you want to delete this user?")) {
    document.deleteUserForm.submit();
  } else {
    return false;
  }
}
