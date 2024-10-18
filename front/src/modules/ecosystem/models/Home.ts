export interface IEcosystemItem {
  id: number;
  title: string;
  description: string;
  status: "active" | "new" | "soon";
  type: "self" | "redirect";
  statusText: string;
  path?: string;
  icon?: string;
  background?: string;
  wide?: boolean;
}
