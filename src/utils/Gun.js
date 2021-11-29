import GunDB from "gun/gun";
import "gun/sea";
import { isCrawler } from "./Prerender";

const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const peersConfig = safeParse(process.env.PEERS);

const peers = peersConfig
  ? peersConfig
  : ["https://gun.shock.network/gun", "https://gun-eu.shock.network/gun"];

const wait = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

const _randomString = (length) => {
  let randomString = "";
  const randomChar = function () {
    const n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  };
  while (randomString.length < length) randomString += randomChar();
  return randomString;
};

const _filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

const _isIncompleteGunResponse = (data) => {
  try {
    console.log("Incomplete Gun Response Check:", typeof data, data);
    if (data === null || data === undefined) {
      return true;
    }

    if (Array.isArray(data)) {
      if (!data.length) {
        return true;
      }

      const incompleteCollection = data.reduce((empty, item) => {
        if (empty) {
          return empty;
        }

        return _isIncompleteGunResponse(item);
      });

      return incompleteCollection;
    }

    if (typeof data === "object") {
      if (!data || typeof data.err === "number") {
        return true;
      }

      const stringifiedData = JSON.stringify(data);
      console.log(data, stringifiedData);

      if (stringifiedData === "{}") {
        return true;
      }

      const filteredGunProps = Object.entries(data).filter(_filterGunProps);

      console.log(filteredGunProps, filteredGunProps?.length);

      if (!filteredGunProps?.length) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.warn("An error has occurred:", err);
    return true;
  }
};

const parseGunPath = ({ path, gunPointer = Gun }) => {
  let node = gunPointer;

  for (const key of path.split("/")) {
    node = node.get(key);
  }

  return node;
};

export const Gun = GunDB({ axe: false, peers: peers });

window.gun = Gun;

export const fetchPath = ({
  path = "",
  retryDelay = 250,
  retryLimit = 1,
  retryCondition = _isIncompleteGunResponse,
  gunPointer = Gun,
  method = "once",

  _retryCount = 0,
  _fallbackResult,
}) =>
  new Promise((resolve) => {
    const parsedRetryLimit = isCrawler() ? 1 : retryLimit;
    const parsedRetryDelay = isCrawler() ? 200 : retryDelay;

    if (_retryCount > parsedRetryLimit) {
      resolve(_fallbackResult);
      return;
    }
    if (_retryCount > 0) {
      console.log(
        "Retrying event:",
        path,
        `${_retryCount}/${parsedRetryLimit}`
      );
    }
    const GunContext = parseGunPath({ path, gunPointer });
    console.log("Fetching Path:", path, GunContext);

    GunContext[method](async (event) => {
      console.log(path + " Response:", event);
      if (retryCondition && retryCondition(event)) {
        await wait(parsedRetryDelay);
        const retryResult = await fetchPath({
          path,
          retryDelay: parsedRetryDelay,
          retryLimit: parsedRetryLimit,
          retryCondition,
          gunPointer,

          _retryCount: _retryCount + 1,
          _fallbackResult: event,
        });
        resolve(retryResult);
        return;
      }

      resolve(event);
    });
  });

// Wraps GunDB data callbacks to provide better error handling
export const wrap = (callback) => (event) => {
  console.log("Event received!", event);
  if (event?.err) {
    console.error("[GunDB] Event error:", event?.err, event);
  }

  if (!event?.put) {
    console.warn("[GunDB] Item not found:", event?.put, event);
  }

  return callback(
    event,
    event.err || !event.put
      ? {
          field: !event.put ? "key" : "unknown",
          message: event.err
            ? event.err
            : !event.put
            ? "Key not found"
            : "Unknown",
          gunErr: event.err,
        }
      : null
  );
};

export const putPath = ({ path = "", data = {}, gunPointer = Gun }) =>
  new Promise((resolve, reject) => {
    const GunContext = parseGunPath({ path, gunPointer });
    GunContext.put(
      data,
      wrap((event, err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(event);
      })
    );
  });

export const setPath = ({ path = "", data = {}, gunPointer = Gun }) =>
  new Promise((resolve, reject) => {
    const GunContext = parseGunPath({ path, gunPointer });
    const response = GunContext.set(data, (event) => {
      console.log(data);
      resolve(response);
    });
  });

export const listenPath = ({ path = "", gunPointer = Gun, callback }) => {
  const GunContext = parseGunPath({ path, gunPointer });
  return GunContext.on((event) => {
    callback(event);
  });
};

export const createRandomGunUser = () =>
  new Promise((resolve, reject) => {
    const randomAlias = _randomString(10);
    const randomPass = _randomString(10);
    Gun.user().create(randomAlias, randomPass, (event) => {
      if (event.err) {
        console.error("An error has occurred while initializing a new user");
        reject({
          field: "gundb",
          message: "An error has occurred while initializing a new user",
          _error: event.err,
          _event: event,
        });
        return;
      }
      resolve({ ...event, alias: randomAlias, pass: randomPass });
    });
  });

export const authUser = (alias, pass) =>
  new Promise((resolve, reject) => {
    Gun.user().auth(alias, pass, (user) => {
      resolve(user);
    });
  });

export const gunUser = (publicKey) => {
  console.log("Getting Gun User:", publicKey);
  if (!publicKey) {
    throw new Error("Undefined public key");
  }
  return Gun.user(publicKey);
};

// Magic number provided from GunDB docs
export const DEFAULT_ONCE_WAIT_MS = 99;

export const $$_SHOCKWALLET__ENCRYPTED__ = "$$_SHOCKWALLET__ENCRYPTED__";

export const $$__SHOCKWALLET__MSG__ = "$$__SHOCKWALLET__MSG__";
