import { API_PATHS } from "@/constants/api-paths";
import api from "./api";
import type { IUser } from "@/interface/user";

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

// Package API
export const addPackage = async (body: any) => {
  return await api.post(API_PATHS.PACKAGE, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPackages = async () => {
  return await api.get(API_PATHS.PACKAGE);
};
