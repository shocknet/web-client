import { Gun, fetchPath } from "../utils/Gun";

export const ACTIONS = {
  LOAD_USER_WALL: "wall/load",
  LOAD_USER_WALL_TOTAL_PAGES: "wall/loadTotalPages",
  RESET_USER_WALL: "wall/reset",
  UPDATE_WALL_POST: "wallPost/update",
  RESET_USER_DATA: "user/reset",
  LOAD_USER_DATA: "user/load",
  LOAD_USER_AVATAR: "avatar/load",
  UPDATE_USER_PROFILE: "user/update"
};

const _filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

export const getUserAvatar = publicKey => async dispatch => {
  const gunUser = Gun.user(publicKey);
  const avatar = await fetchPath({
    path: "Profile/avatar",
    gunPointer: gunUser
  });

  dispatch({
    type: ACTIONS.UPDATE_USER_PROFILE,
    data: { avatar }
  });

  return avatar;
};

export const getUserProfile = publicKey => async dispatch => {
  const gunUser = Gun.user(publicKey);
  const [
    bio,
    displayName,
    alias,
    lastSeenApp,
    lastSeenNode
  ] = await Promise.all([
    fetchPath({
      path: "bio",
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
    })
  ]);

  const user = {
    bio,
    displayName,
    alias,
    lastSeenNode,
    lastSeenApp
  };

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

export const getUserWall = (publicKey, page = 0) => async dispatch => {
  try {
    const gunPointer = Gun.user(publicKey);
    const gunPostsKey = `wall/pages/${page}/posts`;
    const rawPosts = await fetchPath({
      path: gunPostsKey,
      gunPointer
    });
    console.log("Posts:", rawPosts);
    console.log("Page:", page);
    const filteredRawPosts = Object.entries(rawPosts ?? {}).filter(
      _filterGunProps
    );
    const fetchedPosts = await Promise.all(
      filteredRawPosts.map(async ([id], key) => {
        const wallPost = await fetchPath({
          path: `${gunPostsKey}/${id}`,
          gunPointer
        });
        const contentItemsKey = `${gunPostsKey}/${id}/contentItems`;
        const contentItems = await fetchPath({
          path: contentItemsKey,
          gunPointer
        });
        const filteredContentItems = Object.entries(contentItems).filter(
          _filterGunProps
        );
        const fetchedContentItems = await Promise.all(
          filteredContentItems.map(async ([id]) => {
            const type = await fetchPath({
              path: `${contentItemsKey}/${id}/type`,
              gunPointer
            });

            if (type === "text/paragraph") {
              const text = await fetchPath({
                path: `${contentItemsKey}/${id}/text`,
                gunPointer
              });
              return {
                text,
                type
              };
            }

            if (type === "video/embedded") {
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
              return {
                magnetURI,
                width,
                height,
                type
              };
            }

            if (type === "image/embedded") {
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
              return {
                magnetURI,
                width,
                height,
                type
              };
            }

            return {
              text: "Unsupported media type",
              type
            };
          })
        );

        return {
          ...(wallPost ?? {}),
          id,
          contentItems: fetchedContentItems ?? [],
          page
        };
      })
    );

    console.log(`User wall page #${page}`, fetchedPosts);

    const sortedPosts = fetchedPosts?.sort((a, b) => b.date - a.date);

    dispatch({
      type: ACTIONS.LOAD_USER_WALL,
      data: { posts: sortedPosts, page: page }
    });

    return fetchedPosts;
  } catch (err) {
    console.error(err);
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
