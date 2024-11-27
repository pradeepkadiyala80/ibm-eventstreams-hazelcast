import * as logHelpers from "../../components/utils/logHelpers";
const loggers = logHelpers.loggers;
const logger = loggers.get("app");
import { ERROR_CODES } from "../../components/errors/error.codes";

export function success(res, responseObj, startingTime: [number, number]) {
  let log: any = logHelpers.initCompleteLogMeta(
    startingTime,
    "Successful request completion"
  );
  logger.info(log);

  return res.status(200).json(responseObj);
}

export function failed(res, err, startingTime: [number, number]) {
  let errCode = err.status ? err.status : ERROR_CODES.CRITICAL_ERROR;
  let log: any = logHelpers.initErrorLogMetaComplete(
    startingTime,
    ERROR_CODES[errCode],
    err.message,
    err
  );
  logger.error(log);
  if (errCode === ERROR_CODES.CRITICAL_ERROR) {
    return res.status(errCode).json({ message: "Failed to perform request" });
  }
  return res.status(errCode).json({ message: err.message });
}
