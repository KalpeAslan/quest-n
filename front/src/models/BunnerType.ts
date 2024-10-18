export interface IBunnerData {
  title: string;
  linkTo: string;
  image: string;
}

export const bunnerDayEnd = "2023-01-07";

export interface Advertisement {
  id: number;
  title: string;
  icon: boolean;
  tooltip: string | null;
  items: {
    text: string;
    url?: string | null;
    highlighted?: boolean;
  }[];
}
