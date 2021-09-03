import { isCrawler } from "./Prerender";

export const runSerial = tasks => {
  let result = Promise.resolve();
  tasks.forEach(task => {
    result = result.then(() => task());
  });
  return result;
};

export const crawlerAwait = async (...promises) => {
  if (isCrawler()) {
    return await Promise.all(promises);
  }
};
