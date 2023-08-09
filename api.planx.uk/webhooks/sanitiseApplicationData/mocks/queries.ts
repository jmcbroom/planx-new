export const mockIds = ["id1", "id2", "id3"];

export const mockSanitiseLowcalSessionsMutation = {
  name: "SanitiseLowcalSessions",
  matchOnVariables: false,
  data: {
    update_lowcal_sessions: {
      returning: mockIds,
    },
  },
};

export const mockSanitiseUniformApplicationsMutation = {
  name: "SanitiseUniformApplications",
  matchOnVariables: false,
  data: {
    update_uniform_applications: {
      returning: mockIds,
    },
  },
};

export const mockSanitiseBOPSApplicationsMutation = {
  name: "SanitiseBOPSApplications",
  matchOnVariables: false,
  data: {
    update_bops_applications: {
      returning: mockIds,
    },
  },
};

export const mockSanitiseEmailApplicationsMutation = {
  name: "SanitiseEmailApplications",
  matchOnVariables: false,
  data: {
    update_email_applications: {
      returning: mockIds,
    },
  },
};

export const mockDeleteReconciliationRequestsMutation = {
  name: "DeleteReconciliationRequests",
  matchOnVariables: false,
  data: {
    delete_reconciliation_requests: {
      returning: mockIds,
    },
  },
};

export const mockDeletePaymentRequests = {
  name: "DeletePaymentRequests",
  matchOnVariables: false,
  data: {
    delete_payment_requests: {
      returning: mockIds,
    },
  },
};

export const mockGetExpiredSessionIdsQuery = {
  name: "GetExpiredSessionIds",
  matchOnVariables: false,
  data: {
    lowcal_sessions: [{ id: "id1" }, { id: "id2" }, { id: "id3" }],
  },
};
