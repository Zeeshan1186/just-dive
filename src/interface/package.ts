import type { ILocation } from "./location";

export interface ISlot {
  id: number;
  time: string;
}

export interface ISchedule {
  id: number;
  title: string;
}

export interface IMustRead {
  id: number;
  photo: string;
  description: string;
}

export interface IWhyChooseUs {
  id: number;
  title: string;
  description: string;
}

export interface INote {
  id: number;
  title: string;
}

export interface IPackage {
  id: number;
  name: string;
  location: ILocation;
  price: number;
  is_active: boolean;
  slots: ISlot[];
  package_image: string;
  seats: number;
  duration: number;
  services: string;
  vehicle: string;
  page_image: string;
  iternary: string;
  schedules: ISchedule[];
  mustReads: IMustRead[];
  whyChooseUs: IWhyChooseUs[];
  notes: INote[];
  package_id: number;
}
