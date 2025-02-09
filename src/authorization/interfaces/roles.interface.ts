export interface CreateRole {
  role: string;
  permissions: string[];
}

export interface Role extends CreateRole {
  _id: string;
  isActive: boolean;
}
