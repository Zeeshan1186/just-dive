export const API_PATHS = {
  LOGIN: "api/login",
  ADDRESS: "api/address",
  COUPON: "api/coupon",
  PACKAGE: "api/package",
  PACKAGE_LIST: "api/package",
  ACTIVE_PACKAGE: "api/active-package",
  ACTIVE_PACKAGE_BY_lOCATION: (location: string) =>
    `api/package/location/${location}`,
  PACKAGE_DETAIL: (id: string | number) => `api/package/${id}`,
  PACKAGE_SLOTS_BY_DATE: (id: string | number, date: string) =>
    `api/availability/package?packageId=${id}&date=${date}`,
  CONTACT_SEND: "api/contact/send",
  BOOKING: "api/booking",
  APPLYCOUPON: "api/apply/coupon",
  CONFIRM_BOOKING: "api/confirm-booking",
  BLOGS: "api/blogs",
  BLOG: "/api/blog",
  ADDMEDIA: "/api/media",
  BOOKING_STATUS: (id: number) => `api/enable-disable/booking/${id}`,
};
