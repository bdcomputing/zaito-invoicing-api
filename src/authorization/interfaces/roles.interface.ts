export interface CreateRoleInterface {
  role: string;
  permissions: string[];
}

export interface RoleInterface extends CreateRoleInterface {
  _id: string;
  isActive: boolean;
}
