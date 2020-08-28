import GunDB from "gun/gun";
import "gun/sea";
import "gun/lib/load";
import user from "../reducers/UserReducer";

const safeParse = data => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const peersConfig = safeParse(process.env.PEERS);

const peers = peersConfig ? peersConfig : "http://gun.shock.network:8765/gun";

const wait = ms =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

const _randomString = length => {
  let randomString = "";
  const randomchar = function () {
    const n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  };
  while (randomString.length < length) randomString += randomchar();
  return randomString;
};

const _filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

const _isIncompleteGunResponse = data => {
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
    const stringifiedData = JSON.stringify(data);

    if (stringifiedData === "{}") {
      return true;
    }

    const filteredGunProps = Object.entries(data).filter(_filterGunProps);

    if (!filteredGunProps?.length) {
      return true;
    }
  }

  return data === null || data === undefined;
};

export const Gun = GunDB(peers);

export const fetchPath = ({
  path = "",
  retryDelay = 500,
  retryLimit = 3,
  retryCondition = _isIncompleteGunResponse,
  gunPointer = Gun,
  method = "once",

  _retryCount = 0,
  _fallbackResult
}) =>
  new Promise(resolve => {
    if (_retryCount > retryLimit) {
      resolve(_fallbackResult);
      return;
    }
    if (_retryCount > 0) {
      console.log("Retrying event:", path, `${_retryCount}/${retryLimit}`);
    }
    const GunContext = path
      .split("/")
      .reduce((gun, path) => gun.get(path), gunPointer);
    GunContext[method](async event => {
      console.log(path + " Response:", event);
      if (retryCondition && retryCondition(event)) {
        await wait(retryDelay);
        const retryResult = await fetchPath({
          path,
          retryDelay,
          retryLimit,
          retryCondition,
          gunPointer,

          _retryCount: _retryCount + 1,
          _fallbackResult: event
        });
        resolve(retryResult);
        return;
      }

      resolve(event);
    });
  });

// Wraps GunDB data callbacks to provide better error handling
export const wrap = callback => event => {
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
          gunErr: event.err
        }
      : null
  );
};

export const putPath = ({ path = "", data = {}, gunPointer = Gun }) =>
  new Promise((resolve, reject) => {
    const GunContext = path
      .split("/")
      .reduce((gun, path) => gun.get(path), gunPointer);
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
    const GunContext = path
      .split("/")
      .reduce((gun, path) => gun.get(path), gunPointer);
    const response = GunContext.set(data, event => {
      console.log(data);
      resolve(response);
    });
  });

export const createRandomGunUser = () =>
  new Promise((resolve, reject) => {
    const randomAlias = _randomString(10);
    const randomPass = _randomString(10);
    Gun.user().create(randomAlias, randomPass, event => {
      if (event.err) {
        console.error("An error has occurred while initializing a new user");
        reject({
          field: "gundb",
          message: "An error has occurred while initializing a new user",
          _error: event.err,
          _event: event
        });
        return;
      }
      resolve({ ...event, alias: randomAlias, pass: randomPass });
    });
  });

export const authUser = (alias, pass) =>
  new Promise((resolve, reject) => {
    Gun.user().auth(alias, pass, user => {
      resolve(user);
    });
  });

// Magic number provided from GunDB docs
export const DEFAULT_ONCE_WAIT_MS = 99;
