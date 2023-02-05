export const stringAndExist = (value: string): boolean => {
  return value && typeof value === 'string';
};
export const stringOrNotExist = (value: string | null): boolean => {
  return value === null || (value && typeof value === 'string');
};
export const numberAndExist = (value: number): boolean => {
  return value !== null && value !== undefined && typeof value === 'number';
};
