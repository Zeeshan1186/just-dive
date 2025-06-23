import { API_PATHS } from "@/constants/api-paths";
import api from "./api";
import type { IUser } from "@/interface/user";

const token = localStorage.getItem("token");

export const login = async (body: IUser) => {
  return await api.post(API_PATHS.LOGIN, body);
};

export const getactivePackages = async () => {
  return await api.get(API_PATHS.ACTIVE_PACKAGE); // returns array
};

export const getPackageById = async (id: string | number) => {
  return await api.get(`${API_PATHS.PACKAGE_LIST}/${id}`);
};

export const sendContactForm = async (formData: any) => {
  return await api.post(API_PATHS.CONTACT_SEND, formData);
};
