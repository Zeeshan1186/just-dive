import { API_PATHS } from "@/constants/api-paths";
import api from "./api";
import type { IUser } from "@/interface/user";

const token = localStorage.getItem("token");

export const login = async (body: IUser) => {
  return await api.post(API_PATHS.LOGIN, body);
};
