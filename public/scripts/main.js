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
    if (
        confirm(
            "Are you sure you want to archive this company? This action CAN NOT be undone by YOU.",
        )
    ) {
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
function deleteCompanyCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteCompanyCommentByIdForm.submit();
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
    if (
        confirm(
            "Are you sure you want to archive this contact? This action CAN NOT be undone by YOU.",
        )
    ) {
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
function deleteContactCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteContactCommentByIdForm.submit();
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
    if (
        confirm("Are you sure you want to archive this deal? This action CAN NOT be undone by YOU.")
    ) {
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
function deleteDealCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteDealCommentByIdForm.submit();
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
    if (
        confirm(
            "Are you sure you want to archive this quote? This action CAN NOT be undone by YOU.",
        )
    ) {
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
function deleteQuoteCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteQuoteCommentByIdForm.submit();
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
    if (
        confirm(
            "Are you sure you want to archive this ticket? This action CAN NOT be undone by YOU.",
        )
    ) {
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
function deleteTicketCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteTicketCommentByIdForm.submit();
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
    if (
        confirm("Are you sure you want to archive this task? This action CAN NOT be undone by YOU.")
    ) {
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
function deleteTaskCommentById(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
        document.deleteTaskCommentByIdForm.submit();
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

document.addEventListener("DOMContentLoaded", () => {
    // Get all elements needed
    const openModalBtns = document.querySelectorAll(".open-modal");
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel-modal");
    const modals = document.querySelectorAll(".modal");

    // Open modal function
    openModalBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            document.getElementById(modalId).style.display = "flex";
        });
    });

    // Close modal functions
    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
    });

    // Close when clicking outside modal content
    modals.forEach((modal) => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modals.forEach((modal) => {
                modal.style.display = "none";
            });
        }
    });
});

function saveCompanyView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#company-view-fields").value = elements;

    document.saveCompanyViewForm.submit();
}

function saveContactView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#contact-view-fields").value = elements;

    document.saveContactViewForm.submit();
}

function saveDealView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#deal-view-fields").value = elements;

    document.saveDealViewForm.submit();
}

function saveQuoteView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#quote-view-fields").value = elements;

    document.saveQuoteViewForm.submit();
}

function saveTicketView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#ticket-view-fields").value = elements;

    document.saveTicketViewForm.submit();
}

function saveTaskView() {
    const selected = document.querySelector("#selected");
    const elements = Array.from(selected.children).map((el) => el.id);

    document.querySelector("#task-view-fields").value = elements;

    document.saveTaskViewForm.submit();
}
