export interface CreatePermissionInterface {
  permission: string;
}

export interface PermissionInterface extends CreatePermissionInterface {
  _id: string;
}
