export interface IWorkTypeItem {
  _id?: string;
  label: string;
}

export interface IWorkType {
  _id: string;
  name: string;
  description?: string;
  items: IWorkTypeItem[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
