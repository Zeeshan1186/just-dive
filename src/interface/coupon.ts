import type { IPackage } from "./package";

export interface ICoupon {
  id: number;
  name: string;
  discount: number;
  validity: string;
  times_use: string;
  package: IPackage;
}

export interface IPayloadCoupon {
  name: string;
  discount: number;
  validity: string;
  times_use: string;
  package_id: number;
}
