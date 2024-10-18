import { StaticImageData } from "next/image";

export type Agenda = {
  time: string;
  title: string;
  speakers: { name: string; position: string; avatar: string }[];
};

export type Speaker = {
  image: StaticImageData;
  name: string;
  position: string;
  project: {
    name: string | null;
    link: string | null;
    logo: StaticImageData | null;
  } | null;
  socLinks: {
    linkedin?: string;
    twitter?: string;
  };
};
