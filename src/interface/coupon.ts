import type { IPackage } from "./package";

export interface ICoupon {
  name: string;
  discount: number;
  validity: string;
  times_use: string;
  package: IPackage;
}
