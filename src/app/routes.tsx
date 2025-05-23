export const routes = {
  authLogin: () => `/auth/login`,
  authVerifyRequest: () => `/auth/verify-request`,
  dashboard: () => `/`,
  operation: (params?: string) => `/operation${params ?? ""}`,
  invoicePrefix: () => `/invoice`,
  invoice: () => `/invoice/index`,
  invoiceCreate: () => `/invoice/index/create`,
  invoiceEdit: (id: string) => `/invoice/index/${id}/edit`,
  invoiceShow: (id: string) => `/invoice/index/${id}`,
  client: () => `/invoice/client`,
  provider: () => `/invoice/provider`,
  paymentMode: () => `/invoice/payment-mode`,
};
