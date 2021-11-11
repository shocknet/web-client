import mapValues from "lodash/mapValues";

import { Gun, fetchPath } from "../utils/Gun";

export const ACTIONS = {
  LOAD_USER_WALL: "wall/load",
  LOAD_USER_WALL_TOTAL_PAGES: "wall/loadTotalPages",
  RESET_USER_WALL: "wall/reset",
  PIN_WALL_POST: "wall/pin",
  UPDATE_WALL_POST: "wall/post/update",
  RESET_USER_DATA: "user/reset",
  LOAD_USER_DATA: "user/load",
  LOAD_USER_AVATAR: "avatar/load",
  UPDATE_USER_PROFILE: "user/update",
};

const _filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

const GUN_POSTS_KEY = `posts`;
const GUN_SHARED_POSTS_KEY = `sharedPosts`;

export const getUserAvatar = (publicKey) => async (dispatch) => {
  const avatar = await fetchPath({
    path: "~" + publicKey + "/" + "profileBinary/avatar",
  });

  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data: { avatar },
  });

  return avatar;
};

export const getUserHeader = (publicKey) => async (dispatch) => {
  const gunUser = Gun.user(publicKey);
  const header = await fetchPath({
    path: "~" + publicKey + "/" + "profileBinary/header",
  });

  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data: { header },
  });

  return header;
};

export const fetchUserProfile = async ({
  publicKey,
  includeAvatar = false,
}) => {
  const [bio, displayName, alias, lastSeenApp, lastSeenNode, avatar] =
    await Promise.all([
      fetchPath({
        path: "~" + publicKey + "/" + "Profile/bio",
      }),
      fetchPath({
        path: "~" + publicKey + "/" + "Profile/displayName",
      }),
      fetchPath({
        path: "~" + publicKey + "/" + "alias",
      }),
      fetchPath({
        path: "~" + publicKey + "/" + "Profile/lastSeenApp",
      }),
      fetchPath({
        path: "~" + publicKey + "/" + "Profile/lastSeenNode",
      }),
      includeAvatar
        ? fetchPath({
            path: "~" + publicKey + "/" + "profileBinary/avatar",
          })
        : undefined,
    ]);

  const user = {
    publicKey,
    bio,
    displayName,
    alias,
    lastSeenNode,
    lastSeenApp,
    avatar,
  };

  return user;
};

export const getUserProfile = (publicKey) => async (dispatch) => {
  const user = await fetchUserProfile({ publicKey });

  console.log("User:", user);

  dispatch({
    type: ACTIONS.LOAD_USER_DATA,
    data: user,
  });

  return user;
};

export const getUserPost = async ({ id, publicKey }) => {
  const loadedPost = await new Promise((res) =>
    Gun.user(publicKey)
      .get("posts")
      .get(id)
      .load((x) => res(x), { wait: 1000 })
  );

  loadedPost.contentItems = mapValues(loadedPost.contentItems, (ci) => {
    if (ci.type !== "stream/embedded") {
      return ci;
    }

    return {
      ...ci,
      magnetURI:
        ci.liveStatus === "wasLive" && ci.playbackMagnet
          ? ci.playbackMagnet
          : ci.magnetURI,
      type:
        ci.liveStatus === "wasLive" && ci.playbackMagnet
          ? "video/embedded"
          : ci.type,
      width: 0,
      height: 0,
    };
  });

  return {
    ...(loadedPost ?? {}),
    id,
    type: "post",
  };
};

export const getSharedPost = async ({ id, publicKey }) => {
  const sharedPostKey = `${GUN_SHARED_POSTS_KEY}/${id}`;

  const sharedPost = await fetchPath({
    path: "~" + publicKey + "/" + sharedPostKey,
    retryLimit: 5,
    retryDelay: 1000,
  });

  return {
    id,
    date: sharedPost.shareDate,
    originalAuthor: sharedPost.originalAuthor,
    type: "shared",
  };
};

export const getUserWall = (publicKey) => async (dispatch) => {
  try {
    const [rawPosts, rawSharedPosts] = await Promise.all([
      fetchPath({
        path: "~" + publicKey + "/" + GUN_POSTS_KEY,
        retryLimit: 5,
        retryDelay: 1000,
      }),
      fetchPath({
        path: "~" + publicKey + "/" + GUN_SHARED_POSTS_KEY,
      }),
    ]);
    console.log("Posts:", rawPosts);
    console.log("Shared Posts:", rawSharedPosts);
    const filteredRawPosts = Object.entries(rawPosts ?? {})
      .filter(([, val]) => !!val)
      .filter(_filterGunProps);
    const filteredRawSharedPosts = Object.entries(rawSharedPosts ?? {})
      .filter(([, val]) => !!val)
      .filter(_filterGunProps);
    const fetchedPosts = await Promise.all([
      ...filteredRawPosts.map(([id]) => getUserPost({ id, publicKey })),
      ...filteredRawSharedPosts.map(([id]) =>
        getSharedPost({
          id,
          publicKey,
        })
      ),
    ]);

    console.log(`User wall`, fetchedPosts);

    const sortedPosts = fetchedPosts.sort((a, b) => b.date - a.date);

    dispatch({
      type: ACTIONS.LOAD_USER_WALL,
      data: { posts: sortedPosts, page: 0 },
    });

    return fetchedPosts;
  } catch (err) {
    console.error(err);
  }
};

export const getPinnedPost =
  ({ publicKey, postId, type = "post" }) =>
  async (dispatch) => {
    console.log("Getting Pinned post:", publicKey, postId, type);

    if (!publicKey || !postId) {
      return;
    }

    if (type === "post") {
      const post = await getUserPost({ id: postId, publicKey });

      if (post) {
        dispatch({
          type: ACTIONS.PIN_WALL_POST,
          data: post,
        });
      }

      return post;
    }

    if (type === "sharedPost") {
      const post = await getSharedPost({
        id: "~" + publicKey + "/" + postId,
      });

      if (post) {
        dispatch({
          type: ACTIONS.PIN_WALL_POST,
          data: post,
        });
      }

      return post;
    }
  };

export const updateUserProfile = (data) => (dispatch) => {
  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data,
  });
};

export const updateWallPost = (data) => (dispatch) => {
  dispatch({
    type: ACTIONS.UPDATE_WALL_POST,
    data,
  });
};

export const resetUserWall = () => (dispatch) => {
  dispatch({
    type: ACTIONS.RESET_USER_WALL,
  });
};

export const resetUserData = () => (dispatch) => {
  dispatch({
    type: ACTIONS.RESET_USER_DATA,
  });
};
