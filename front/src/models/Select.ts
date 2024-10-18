export interface ISelectItem {
  id: number;
  title: string;
  value: string;
  isSelected?: boolean;
}

export interface ISelect {
  title: string;
  items: ISelectItem[];
}
