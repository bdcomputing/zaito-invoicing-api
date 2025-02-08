import { generateUniqueBatchNumber } from 'src/shared/helpers';

export const generatePasswordResetCode = (userId?: string) => {
  const prefix: string = generateUniqueBatchNumber();
  const code = `${prefix}${userId}${generateUniqueBatchNumber()}`;
  return code;
};
