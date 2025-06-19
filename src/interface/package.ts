import type { ILocation } from "./location";

export interface IPackage {
  id: number;
  name: string;
  location: ILocation;
  price: number;
  is_active: boolean;
}
