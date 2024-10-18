import { StaticImageData } from "next/image";

export interface IAboutDataItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: StaticImageData;
}

export interface IAboutPointItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  soon: boolean;
  list: string[];
}
