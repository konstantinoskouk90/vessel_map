import { parse } from "papaparse";

export function asyncCsv2Json(file: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parse(file, {
      download: true,
      worker: true,
      header: true,
      dynamicTyping: true,
      delimiter: ",",
      complete(results) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
