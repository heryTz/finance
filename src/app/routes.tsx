export const routes = {
  authLogin: () => `/auth/login`,
  authVerifyRequest: () => `/auth/verify-request`,
  dashboard: () => `/`,
  operation: () => `/operation`,
  invoice: () => `/invoice`,
  invoiceCreate: () => `/invoice/create`,
  invoiceEdit: (id: string) => `/invoice/${id}/edit`,
  invoiceShow: (id: string) => `/invoice/${id}`,
  client: () => `/invoice?tab=client`,
  provider: () => `/invoice?tab=provider`,
  paymentMode: () => `/invoice?tab=payment-mode`,
};
