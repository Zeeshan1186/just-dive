import type { ILocation } from "./location";
import type { IPackage } from "./package";
import type { Slot } from "./slot";

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
  whatsapp_no: string;
  email: string;
  gender: string;
  age: number;
  nationality: string;
  document?: string;
  slot: Slot;
}
