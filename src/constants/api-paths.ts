export const API_PATHS = {
  LOGIN: "api/login",
  PACKAGE_LIST: "api/package",
  ACTIVE_PACKAGE: "api/active-package",
  PACKAGE_DETAIL: (id: string | number) => `api/package/${id}`,
  CONTACT_SEND: "api/contact/send", // ✅ Add this line
};
