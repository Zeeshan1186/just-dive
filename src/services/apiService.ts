import { API_PATHS } from "@/constants/api-paths";
import api from "./api";
import type { IUser } from "@/interface/user";
import type { IPayloadCoupon } from "@/interface/coupon";

const token = localStorage.getItem("token");

export const login = async (body: IUser) => {
  return await api.post(API_PATHS.LOGIN, body);
};

// Location API
export const getLocations = async () => {
  return await api.get(API_PATHS.ADDRESS);
};

export const addLocation = async (data: any) => {
  return await api.post(API_PATHS.ADDRESS, data);
};

export const getLocationById = async (id: number) => {
  return await api.get(`${API_PATHS.ADDRESS}/${id}`);
};

export const editLocation = async (data: any, id: number) => {
  return await api.put(`${API_PATHS.ADDRESS}/${id}`, data);
};

// Coupon API
export const getCoupons = async () => {
  return await api.get(API_PATHS.COUPON);
};

export const getCoupon = async (id: number) => {
  return await api.get(`${API_PATHS.COUPON}/${id}`);
};

export const addCoupon = async (data: IPayloadCoupon) => {
  return await api.post(API_PATHS.COUPON, data);
};

export const editCoupon = async (data: IPayloadCoupon, id: number) => {
  return await api.put(`${API_PATHS.COUPON}/${id}`, data);
};

// Package API
export const addPackage = async (body: any) => {
  return await api.post(API_PATHS.PACKAGE, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const enableDisablePackage = async (id: number, isEnable: boolean) => {
  return await api.get(
    `${API_PATHS.PACKAGE}/status/${id}?is_enable=${isEnable}`
  );
};

export const editPackage = async (id: number, body: any) => {
  return await api.post(`api/edit-package/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPackageById = async (id: number) => {
  return await api.get(`${API_PATHS.PACKAGE}/${id}`);
};

export const getPackages = async () => {
  return await api.get(API_PATHS.PACKAGE);
};

export const getactivePackages = async () => {
  return await api.get(API_PATHS.ACTIVE_PACKAGE);
};

export const getactivePackagesByLocation = async (location: string) => {
  return await api.get(API_PATHS.ACTIVE_PACKAGE_BY_lOCATION(location));
};

// Booking
export const postBooking = async (formData: any) => {
  return await api.post(API_PATHS.BOOKING, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const rescheduleBooking = async (id: number, formData: any) => {
  return await api.post(`${API_PATHS.BOOKING}/reschedule/${id}`, formData);
};

export const updateBookingStatus = async (id: number, status: string) => {
  return await api.get(`${API_PATHS.BOOKING_STATUS(id)}?status=${status}`);
};

export const deleteBooking = async (id: number) => {
  return await api.delete(`${API_PATHS.BOOKING}/${id}`);
};

export const getBookingById = async (id: number) => {
  return await api.get(`${API_PATHS.BOOKING}/${id}`);
};

export const getActiveBooking = async (
  status: string,
  packageData?: string
) => {
  return await api.get(
    `${API_PATHS.CONFIRM_BOOKING}?status=${status}&package=${packageData}`
  );
};

// If API accepts coupon code or package ID as query:
export const applyCoupon = async (
  packageId: number,
  couponCode: string,
  numberOfPerson: number
) => {
  return await api.post(API_PATHS.APPLYCOUPON, {
    package_id: packageId,
    coupon_code: couponCode,
    number_of_person: numberOfPerson,
  });
};

export const sendContactForm = async (formData: any) => {
  return await api.post(API_PATHS.CONTACT_SEND, formData);
};

export const getPackageSlotsByDate = async (
  packageId: number,
  date: string
) => {
  return await api.get(API_PATHS.PACKAGE_SLOTS_BY_DATE(packageId, date));
};

export const getBlogs = async () => {
  return await api.get(API_PATHS.BLOGS);
};

export const getBlogById = async (id: number | string) => {
  return await api.get(`api/blog/${id}`);
};

export const addBlog = async (data: any) => {
  return await api.post(API_PATHS.BLOG, data, {
    headers: {
      "Content-Type": "multipart/form-data", // Because images
    },
  });
};

export const updateBlog = async (id: number | string, data: FormData) => {
  return await api.post(`/api/blog/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBlog = async (id: number) => {
  return await api.delete(`${API_PATHS.BLOG}/${id}`);
};

export const addMedia = async (formData: FormData) => {
  return await api.post("/api/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMedia = async () => {
  return await api.get("/api/media");
};

export const deleteMedia = async (id: number) => {
  return await api.delete(`/api/media/${id}`);
};

export const getTermscondition = async () => {
  return await api.get(`${API_PATHS.TERMSCONDITION}`);
};

export const addTermscondition = async (payload: any) => {
  return await api.post(`${API_PATHS.TERMSCONDITION}`, payload);
};

export const updateTermscondition = async (id: number, payload: any) => {
  return await api.put(`${API_PATHS.TERMSCONDITION}/${id}`, payload);
};

export const deleteTermscondition = async (id: number) => {
  return await api.delete(`${API_PATHS.TERMSCONDITION}/${id}`);
};

// Dashboard API
export const getDashboard = async (
  mode?: string,
  startDate?: string,
  endDate?: string
) => {
  return await api.get(
    `${API_PATHS.DASHBOARD}?mode=${mode}&startDate=${startDate}&endDate=${endDate}`
  );
};

// Report API
export const getReport = async (
  mode?: string,
  startDate?: string,
  endDate?: string,
  packageId?: string
) => {
  return await api.get(
    `${API_PATHS.REPORT}?mode=${mode}&startDate=${startDate}&endDate=${endDate}&package_id=${packageId}`
  );
};

export const getBlogscategories = async () => api.get("/api/blog-category");
export const createBlogCategory = async (data: { name: string }) =>
  api.post("/api/blog-category", data);
export const deleteBlogCategory = async (id: number) =>
  api.delete(`/api/blog-category/${id}`);
export const updateBlogCategory = async (
  id: number,
  payload: { name: string }
) => {
  return await api.put(`/api/blog-category/${id}`, payload);
};
export const getCategories = async () => {
  return await api.get("/your-categories-api-endpoint");
};
export const getBlogsByCategoryId = (categoryId: string | number) => {
  return api.get(`/api/blog/category/${categoryId}`);
};
