export enum AccountTypeEnum {
  CORPORATE_ACCOUNT = 'corporate',
  INDIVIDUAL_ACCOUNT = 'individual',
}

export const AccountTypeData = () => {
  const types = [
    {
      name: 'Individual Account',
      value: AccountTypeEnum.INDIVIDUAL_ACCOUNT,
    },
    {
      name: 'Corporate Account',
      value: AccountTypeEnum.CORPORATE_ACCOUNT,
    },
  ];
  return types;
};
