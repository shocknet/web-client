import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Moment from "moment";
import { gunUser, listenPath } from "../utils/Gun";

const ONLINE_INTERVAL = 30 * 1000;

const useOnlineStatus = publicKey => {
  const dispatch = useDispatch();
  const profile = useSelector(({ user }) => user.profile);

  const [lastSeenApp, setLastSeenApp] = useState(false);
  const [lastSeenNode, setLastSeenNode] = useState(false);
  const [isOnlineApp, setIsOnlineApp] = useState(false);
  const [isOnlineNode, setIsOnlineNode] = useState(false);
  const [onlineCheckTimer, setOnlineCheckTimer] = useState();

  const updateUserStatus = useCallback(() => {
    const onlineThreshold = Moment.utc().subtract(1, "minutes");
    const isOnlineNode =
      Moment.utc(lastSeenNode).isSameOrAfter(onlineThreshold);
    const isOnlineApp = Moment.utc(lastSeenApp).isSameOrAfter(onlineThreshold);

    setIsOnlineNode(isOnlineNode);
    setIsOnlineApp(isOnlineApp);
  }, [lastSeenApp, lastSeenNode]);

  useEffect(() => {
    if (onlineCheckTimer) {
      clearTimeout(onlineCheckTimer);
    }

    updateUserStatus();

    const timer = setTimeout(() => {
      updateUserStatus();
    }, ONLINE_INTERVAL);

    setOnlineCheckTimer(timer);

    return () => clearTimeout(onlineCheckTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, updateUserStatus]);

  useEffect(() => {
    const lastSeenAppListener = listenPath({
      path: "Profile/lastSeenApp",
      gunPointer: gunUser(publicKey),
      callback: event => {
        setLastSeenApp(event);
      }
    });

    const lastSeenNodeListener = listenPath({
      path: "Profile/lastSeenNode",
      gunPointer: gunUser(publicKey),
      callback: event => {
        setLastSeenNode(event);
      }
    });

    return () => {
      lastSeenAppListener.off();
      lastSeenNodeListener.off();
    };
  }, [dispatch, publicKey]);

  return {
    isOnlineApp,
    isOnlineNode
  };
};

export default useOnlineStatus;
