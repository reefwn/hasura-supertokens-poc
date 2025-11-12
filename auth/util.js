export const debugResponse = (fn, data) => {
  const json = JSON.stringify(data);
  console.debug(`${fn} response: ${json}`);
}