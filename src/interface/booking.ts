import type { ILocation } from "./location";
import type { IPackage } from "./package";

export interface IBooking {
  id: number;
  package: IPackage;
  full_name: string;
  date_of_scuba: string;
  created_at: string;
  location: ILocation;
  number_of_participants: number;
  price: number;
  status: string;
}
