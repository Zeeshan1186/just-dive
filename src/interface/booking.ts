import type { ICoupon } from "./coupon";
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
  whatsapp_no: string;
  email: string;
  gender: string;
  age: number;
  nationality: string;
  document?: string;
  slot: string;
  booking_id: string;
  is_admin_booking: boolean;
  coupon_id?: number;
  coupon?: ICoupon;
}
