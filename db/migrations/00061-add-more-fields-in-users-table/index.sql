ALTER TABLE "users"
ADD COLUMN "canAccessCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessTask" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessReport" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canAccessCommentOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessCommentOnContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessCommentOnDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessCommentOnQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessCommentOnTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessCommentOnTask" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canAccessFileOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFileOnContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFileOnDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFileOnQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFileOnTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canAccessFileOnTask" BOOLEAN DEFAULT TRUE,

ADD COLUMN "showContactOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showDealOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showQuoteOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTicketOnCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTaskOnCompany" BOOLEAN DEFAULT TRUE,

ADD COLUMN "showDealOnContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showQuoteOnContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTicketOnContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTaskOnContact" BOOLEAN DEFAULT TRUE,

ADD COLUMN "showQuoteOnDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTicketOnDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTaskOnDeal" BOOLEAN DEFAULT TRUE,

ADD COLUMN "showTaskOnQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "showTaskOnTicket" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveCompany" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteCompany" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewCompanyComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateCompanyComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditCompanyComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveCompanyComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteCompanyComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewCompanyFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateCompanyFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditCompanyFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveCompanyFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteCompanyFile" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveContact" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteContact" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewContactComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateContactComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditContactComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveContactComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteContactComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewContactFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateContactFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditContactFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveContactFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteContactFile" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveDeal" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteDeal" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewDealComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateDealComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditDealComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveDealComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteDealComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewDealFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateDealFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditDealFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveDealFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteDealFile" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveQuote" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteQuote" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewQuoteComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateQuoteComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditQuoteComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveQuoteComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteQuoteComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewQuoteFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateQuoteFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditQuoteFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveQuoteFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteQuoteFile" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTicket" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTicket" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTicketComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTicketComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTicketComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTicketComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTicketComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTicketFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTicketFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTicketFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTicketFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTicketFile" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTask" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTask" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTask" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTask" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTask" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTaskComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTaskComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTaskComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTaskComment" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTaskComment" BOOLEAN DEFAULT TRUE,

ADD COLUMN "canViewTaskFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canCreateTaskFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canEditTaskFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canArchiveTaskFile" BOOLEAN DEFAULT TRUE,
ADD COLUMN "canDeleteTaskFile" BOOLEAN DEFAULT TRUE;