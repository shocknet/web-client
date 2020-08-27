import GunDB from "gun/gun";
import "gun/sea";
import "gun/lib/load";

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
    GunContext.once(async event => {
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
    return;
  }

  if (!event?.put) {
    console.warn("[GunDB] Item not found:", event?.put, event);
    return;
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
            : "Unknown"
        }
      : null
  );
};

// Magic number provided from GunDB docs
export const DEFAULT_ONCE_WAIT_MS = 99;
