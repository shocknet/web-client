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
  UPDATE_USER_PROFILE: "user/update"
};

const _filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

const GUN_POSTS_KEY = `posts`;
const GUN_SHARED_POSTS_KEY = `sharedPosts`;

export const getUserAvatar = publicKey => async dispatch => {
  const gunUser = Gun.user(publicKey);
  const avatar = await fetchPath({
    path: "profileBinary/avatar",
    gunPointer: gunUser
  });

  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data: { avatar }
  });

  return avatar;
};

export const getUserHeader = publicKey => async dispatch => {
  const gunUser = Gun.user(publicKey);
  const header = await fetchPath({
    path: "profileBinary/header",
    gunPointer: gunUser
  });

  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data: { header }
  });

  return header;
};

export const fetchUserProfile = async ({
  publicKey,
  includeAvatar = false
}) => {
  const gunUser = Gun.user(publicKey);
  const [bio, displayName, alias, lastSeenApp, lastSeenNode, avatar] =
    await Promise.all([
      fetchPath({
        path: "Profile/bio",
        gunPointer: gunUser
      }),
      fetchPath({
        path: "Profile/displayName",
        gunPointer: gunUser
      }),
      fetchPath({
        path: "alias",
        gunPointer: gunUser
      }),
      fetchPath({
        path: "Profile/lastSeenApp",
        gunPointer: gunUser
      }),
      fetchPath({
        path: "Profile/lastSeenNode",
        gunPointer: gunUser
      }),
      includeAvatar
        ? fetchPath({
            path: "profileBinary/avatar",
            gunPointer: gunUser
          })
        : undefined
    ]);

  const user = {
    publicKey,
    bio,
    displayName,
    alias,
    lastSeenNode,
    lastSeenApp,
    avatar
  };

  return user;
};

export const getUserProfile = publicKey => async dispatch => {
  const user = await fetchUserProfile({ publicKey });

  console.log("User:", user);

  dispatch({
    type: ACTIONS.LOAD_USER_DATA,
    data: user
  });

  return user;
};

export const getWallTotalPages = publicKey => async dispatch => {
  const totalPages = await fetchPath({
    path: "wall/numOfPages",
    gunPointer: Gun.user(publicKey)
  });

  if (!totalPages && totalPages !== 0) {
    throw {
      field: "publicKey",
      message: "Wall was not found for the specified user"
    };
  }

  dispatch({
    type: ACTIONS.LOAD_USER_WALL_TOTAL_PAGES,
    data: totalPages
  });

  return totalPages;
};

export const getUserPost = async ({ id, gunPointer }) => {
  const wallPostKey = `${GUN_POSTS_KEY}/${id}`;
  const contentItemsKey = `${wallPostKey}/contentItems`;
  const start = Date.now();

  console.log(`Fetching Post (${id})...`);

  const [wallPost, contentItems] = await Promise.all([
    fetchPath({
      path: wallPostKey,
      gunPointer
    }),
    fetchPath({
      path: contentItemsKey,
      gunPointer
    })
  ]);
  const filteredContentItems =
    Object.entries(contentItems).filter(_filterGunProps);
  console.log("Filtered Content Items:", filteredContentItems);
  const fetchedContentItems = await Promise.all(
    filteredContentItems.map(async ([id, item]) => {
      console.log("Content Item:", { id, item });
      const type = await fetchPath({
        path: `${contentItemsKey}/${id}/type`,
        gunPointer
      });

      if (type === "text/paragraph") {
        console.log(
          `Loading Post (${id}) text: Started at ${Date.now() - start}ms`
        );
        const text = await fetchPath({
          path: `${contentItemsKey}/${id}/text`,
          gunPointer
        });

        console.log(`Loaded Post (${id}) text in ${Date.now() - start}ms`);

        return {
          text,
          type
        };
      }

      if (type === "video/embedded") {
        console.log(
          `Loading Post (${id}) video: Started at ${Date.now() - start}ms`
        );
        const [magnetURI, width, height] = await Promise.all([
          fetchPath({
            path: `${contentItemsKey}/${id}/magnetURI`,
            gunPointer
          }),
          fetchPath({
            path: `${contentItemsKey}/${id}/width`,
            gunPointer
          }),
          fetchPath({
            path: `${contentItemsKey}/${id}/height`,
            gunPointer
          })
        ]);
        console.log(`Loaded Post (${id}) video in ${Date.now() - start}ms`);
        return {
          magnetURI,
          width,
          height,
          type
        };
      }

      if (type === "image/embedded") {
        console.log(
          `Loading Post (${id}) image: Started at ${Date.now() - start}ms`
        );
        const [magnetURI, width, height] = await Promise.all([
          fetchPath({
            path: `${contentItemsKey}/${id}/magnetURI`,
            gunPointer
          }),
          fetchPath({
            path: `${contentItemsKey}/${id}/width`,
            gunPointer
          }),
          fetchPath({
            path: `${contentItemsKey}/${id}/height`,
            gunPointer
          })
        ]);
        console.log(`Loaded Post (${id}) image in ${Date.now() - start}ms`);
        return {
          magnetURI,
          width,
          height,
          type
        };
      }
      if (type === "stream/embedded") {
        console.log(
          `Loading Post (${id}) stream: Started at ${Date.now() - start}ms`
        );
        const [magnetURI, liveStatus, playbackMagnet, viewersCounter] =
          await Promise.all([
            fetchPath({
              path: `${contentItemsKey}/${id}/magnetURI`,
              gunPointer
            }),
            fetchPath({
              path: `${contentItemsKey}/${id}/liveStatus`,
              gunPointer
            }),
            fetchPath({
              path: `${contentItemsKey}/${id}/playbackMagnet`,
              gunPointer
            }),
            fetchPath({
              path: `${contentItemsKey}/${id}/viewersCounter`,
              gunPointer
            })
          ]);
        console.log(`Loaded Post (${id}) stream in ${Date.now() - start}ms`);
        let finalType = type;
        let finalMagnet = magnetURI;
        if (liveStatus === "wasLive" && playbackMagnet) {
          finalMagnet = playbackMagnet;
          finalType = "video/embedded";
        }
        return {
          magnetURI: finalMagnet,
          width: 0,
          height: 0,
          type: finalType,
          liveStatus,
          playbackMagnet,
          viewersCounter
        };
      }

      return {
        text: "Unsupported media type",
        type
      };
    })
  );

  console.log(`Post (${id}) took ${Date.now() - start}ms to load!`);

  return {
    ...(wallPost ?? {}),
    id,
    contentItems: fetchedContentItems ?? [],
    type: "post"
  };
};

export const getSharedPost = async ({ id, sharedGunPointer }) => {
  const sharedPostKey = `${GUN_SHARED_POSTS_KEY}/${id}`;

  const sharedPost = await fetchPath({
    path: sharedPostKey,
    gunPointer: sharedGunPointer
  });

  return {
    id,
    date: sharedPost.shareDate,
    originalAuthor: sharedPost.originalAuthor,
    type: "shared"
  };
};

export const getUserWall = publicKey => async dispatch => {
  try {
    const gunPointer = Gun.user(publicKey);
    const rawPosts = await fetchPath({
      path: GUN_POSTS_KEY,
      gunPointer
    });
    const rawSharedPosts = await fetchPath({
      path: GUN_SHARED_POSTS_KEY,
      gunPointer
    });
    console.log("Posts:", rawPosts);
    console.log("Shared Posts:", rawSharedPosts);
    const filteredRawPosts = Object.entries(rawPosts ?? {}).filter(
      _filterGunProps
    );
    const filteredRawSharedPosts = Object.entries(rawSharedPosts ?? {}).filter(
      _filterGunProps
    );
    const fetchedPosts = await Promise.all([
      ...filteredRawPosts.map(([id], key) =>
        getUserPost({ id, gunPointer: Gun.user(publicKey) })
      ),
      ...filteredRawSharedPosts.map(([id], key) =>
        getSharedPost({
          id,
          sharedGunPointer: Gun.user(publicKey)
        })
      )
    ]);

    console.log(`User wall`, fetchedPosts);

    const sortedPosts = fetchedPosts.sort((a, b) => b.date - a.date);

    dispatch({
      type: ACTIONS.LOAD_USER_WALL,
      data: { posts: sortedPosts, page: 0 }
    });

    return fetchedPosts;
  } catch (err) {
    console.error(err);
  }
};

export const getPinnedPost =
  ({ publicKey, postId, type = "post" }) =>
  async dispatch => {
    console.log("Getting Pinned post:", publicKey, postId, type);

    if (!publicKey || !postId) {
      return;
    }

    const gunPointer = Gun.user(publicKey);

    if (type === "post") {
      const post = await getUserPost({ id: postId, gunPointer });

      if (post) {
        dispatch({
          type: ACTIONS.PIN_WALL_POST,
          data: post
        });
      }

      return post;
    }

    if (type === "sharedPost") {
      const post = await getSharedPost({
        id: postId,
        sharedGunPointer: gunPointer
      });

      if (post) {
        dispatch({
          type: ACTIONS.PIN_WALL_POST,
          data: post
        });
      }

      return post;
    }
  };

export const updateUserProfile = data => dispatch => {
  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data
  });
};

export const updateWallPost = data => dispatch => {
  dispatch({
    type: ACTIONS.UPDATE_WALL_POST,
    data
  });
};

export const resetUserWall = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_USER_WALL
  });
};

export const resetUserData = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_USER_DATA
  });
};
