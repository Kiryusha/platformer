// https://stackoverflow.com/questions/42341331/es6-promise-all-progress

export function promiseAllProgress(promises: Promise<any>[], callback: Callback) {
  let d = 0;
  callback(0);
  for (const p of promises) {
    p.then(() => {
      d ++;
      callback( (d * 100) / promises.length );
    });
  }
  return Promise.all(promises);
}
