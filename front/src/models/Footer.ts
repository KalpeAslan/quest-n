export interface IMenuLink {
  id: number;
  path: string;
  title: string;
  disabled: boolean;
  type: "self" | "redirect" | "reopen";
  icon?: string;
}
