console.log("RMS loaded");

const companyActionHandlers = {
    active: () => {
        if (confirm("Are you sure you want to active this company?")) {
            document.activeCompanyForm.submit();
        }
    },
    archive: () => {
        if (confirm("Are you sure you want to archive this company?")) {
            document.archiveCompanyForm.submit();
        }
    },
    delete: () => {
        if (confirm("Are you sure you want to delete this company?")) {
            document.deleteCompanyForm.submit();
        }
    },
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-company-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const action = button.dataset.companyAction;
            const handler = companyActionHandlers[action];

            if (handler) {
                handler();
            }
        });
    });
});
