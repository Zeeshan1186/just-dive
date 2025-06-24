export const API_PATHS = {
  LOGIN: "api/login",
  ADDRESS: "api/address",
  COUPON: "api/coupon",
  PACKAGE: "api/package",
  PACKAGE_LIST: "api/package",
  ACTIVE_PACKAGE: "api/active-package",
  PACKAGE_DETAIL: (id: string | number) => `api/package/${id}`,
  PACKAGE_SLOTS_BY_DATE: (id: string | number, date: string) =>
    `api/packages/${id}/slots?date=${date}`, // ✅ new
  CONTACT_SEND: "api/contact/send",
};
