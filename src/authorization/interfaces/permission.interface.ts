export interface CreatePermission {
  permission: string;
}

export interface Permission extends CreatePermission {
  _id: string;
}
