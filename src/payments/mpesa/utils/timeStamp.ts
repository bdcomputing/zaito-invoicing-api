// generate timestamp
export const generateTimeStamp = () => {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
};
