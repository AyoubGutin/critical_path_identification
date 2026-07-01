export const getNextTaskId = (index: number): string => {
  let id = '';
  let temp = index;
  while (temp >= 0) {
    id = String.fromCharCode((temp % 26) + 65) + id;
    temp = Math.floor(temp / 26) - 1;
  }
  return id;
};
