import { API_PATHS } from "@/constants/api-paths";
import api from "./api";
import type { IUser } from "@/interface/user";
import type { ICoupon, IPayloadCoupon } from "@/interface/coupon";

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
  return await api.post(API_PATHS.BOOKING, formData);
};

export const getActiveBooking = async (status: string) => {
  return await api.get(`${API_PATHS.CONFIRM_BOOKING}?status=${status}`);
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
