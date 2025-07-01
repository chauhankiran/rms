const sql = require("../db/sql");

module.exports = {
    login: async (authOptions) => {
        const { email } = authOptions;

        return await sql`
            SELECT
                id,
                email,
                password,
                "isRequiredToChangePassword",
                "isActive",
                type,

                "canAccessCompany",
                "canAccessContact",
                "canAccessDeal",
                "canAccessQuote",
                "canAccessTicket",
                "canAccessTask",
                "canAccessReport",
                "canAccessFile",
                "canAccessComment",

                "canAccessCommentOnCompany",
                "canAccessCommentOnContact",
                "canAccessCommentOnDeal",
                "canAccessCommentOnQuote",
                "canAccessCommentOnTicket",
                "canAccessCommentOnTask",

                "canAccessFileOnCompany",
                "canAccessFileOnContact",
                "canAccessFileOnDeal",
                "canAccessFileOnQuote",
                "canAccessFileOnTicket",
                "canAccessFileOnTask",

                "showContactOnCompany",
                "showDealOnCompany",
                "showQuoteOnCompany",
                "showTicketOnCompany",
                "showTaskOnCompany",

                "showDealOnContact",
                "showQuoteOnContact",
                "showTicketOnContact",
                "showTaskOnContact",

                "showQuoteOnDeal",
                "showTicketOnDeal",
                "showTaskOnDeal",

                "showTaskOnQuote",
                "showTaskOnTicket",

                "canViewCompany",
                "canCreateCompany",
                "canEditCompany",
                "canArchiveCompany",
                "canDeleteCompany",

                "canViewCompanyComment",
                "canCreateCompanyComment",
                "canEditCompanyComment",
                "canArchiveCompanyComment",
                "canDeleteCompanyComment",

                "canViewCompanyFile",
                "canCreateCompanyFile",
                "canEditCompanyFile",
                "canArchiveCompanyFile",
                "canDeleteCompanyFile",

                "canViewContact",
                "canCreateContact",
                "canEditContact",
                "canArchiveContact",
                "canDeleteContact",

                "canViewContactComment",
                "canCreateContactComment",
                "canEditContactComment",
                "canArchiveContactComment",
                "canDeleteContactComment",

                "canViewContactFile",
                "canCreateContactFile",
                "canEditContactFile",
                "canArchiveContactFile",
                "canDeleteContactFile",

                "canViewDeal",
                "canCreateDeal",
                "canEditDeal",
                "canArchiveDeal",
                "canDeleteDeal",

                "canViewDealComment",
                "canCreateDealComment",
                "canEditDealComment",
                "canArchiveDealComment",
                "canDeleteDealComment",

                "canViewDealFile",
                "canCreateDealFile",
                "canEditDealFile",
                "canArchiveDealFile",
                "canDeleteDealFile",

                "canViewQuote",
                "canCreateQuote",
                "canEditQuote",
                "canArchiveQuote",
                "canDeleteQuote",

                "canViewQuoteComment",
                "canCreateQuoteComment",
                "canEditQuoteComment",
                "canArchiveQuoteComment",
                "canDeleteQuoteComment",

                "canViewQuoteFile",
                "canCreateQuoteFile",
                "canEditQuoteFile",
                "canArchiveQuoteFile",
                "canDeleteQuoteFile",

                "canViewTicket",
                "canCreateTicket",
                "canEditTicket",
                "canArchiveTicket",
                "canDeleteTicket",

                "canViewTicketComment",
                "canCreateTicketComment",
                "canEditTicketComment",
                "canArchiveTicketComment",
                "canDeleteTicketComment",

                "canViewTicketFile",
                "canCreateTicketFile",
                "canEditTicketFile",
                "canArchiveTicketFile",
                "canDeleteTicketFile",

                "canViewTask",
                "canCreateTask",
                "canEditTask",
                "canArchiveTask",
                "canDeleteTask",

                "canViewTaskComment",
                "canCreateTaskComment",
                "canEditTaskComment",
                "canArchiveTaskComment",
                "canDeleteTaskComment",

                "canViewTaskFile",
                "canCreateTaskFile",
                "canEditTaskFile",
                "canArchiveTaskFile",
                "canDeleteTaskFile"
            FROM
                users
            WHERE
                email = ${email}
        `.then(([x]) => x);
    },

    register: async (authOptions) => {
        const { email, password } = authOptions;

        return await sql`
            INSERT INTO users (
                email,
                password
            ) VALUES (
                ${email},
                ${password}
            ) returning id
        `.then(([x]) => x);
    },

    reset: async (authObj) => {
        const { password, updatedBy, id } = authObj;

        return await sql`
            UPDATE
                users
            SET
                password = ${password},
                "isRequiredToChangePassword" = false,
                "updatedBy" = ${updatedBy},
                "updatedAt" = ${sql`now()`}
            WHERE
                id = ${id}
            returning id
        `.then(([x]) => x);
    },

    findUserByEmail: async (email) => {
        return await sql`
            SELECT
                id,
                email,
                "isActive",
                type
            FROM
                users
            WHERE
                email = ${email}
        `.then(([x]) => x);
    },

    updateResetToken: async (authObj) => {
        const { email, token, expiresIn } = authObj;

        return await sql`
            UPDATE
                users
            SET
                "resetToken" = ${token},
                "resetTokenExpiresIn" = ${expiresIn}
            WHERE
                email = ${email}
            returning id
        `.then(([x]) => x);
    },

    resetPassword: async (authObj) => {
        const { password, token } = authObj;

        return await sql`
            UPDATE
                users
            SET
                password = ${password},
                "updatedAt" = ${sql`now()`}
            WHERE
                "resetToken" = ${token}
            returning id
        `.then(([x]) => x);
    },
};
