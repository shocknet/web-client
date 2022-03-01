import { ACTIONS } from "../actions/UserActions";

const INITIAL_STATE = {
  wall: {
    posts: [],
    // Specifying -1 is helpful for determining whether or not
    // the wall was loaded at all
    page: -1,
    totalPages: 0
  },
  profile: {}
};

const user = (state = INITIAL_STATE, action) => {
  const { data } = action;

  switch (action.type) {
    case ACTIONS.LOAD_USER_WALL: {
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: [...state.wall.posts, ...data.posts].sort(
            (a, b) => b.date - a.date
          ),
          page: data.page
        }
      };
    }
    case ACTIONS.LOAD_USER_WALL_TOTAL_PAGES: {
      return {
        ...state,
        wall: {
          ...state.wall,
          totalPages: data
        }
      };
    }
    case ACTIONS.LOAD_WALL_POST_CONTENT_LENGTH: {
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: state.wall.posts?.map(post =>
            data.id === post.id
              ? {
                  ...post,
                  contentItems: Array.from({ length: data.length })
                }
              : post
          )
        }
      };
    }
    case ACTIONS.LOAD_WALL_POST_INFO: {
      const loadedPosts = state.wall.posts?.map(post =>
        data.id === post.id
          ? {
              ...post,
              ...data.postInfo,
              contentItems: post.contentItems ?? []
            }
          : post
      );
      const sortedPosts = loadedPosts.sort((a, b) => b.date - a.date);
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: sortedPosts
        }
      };
    }
    case ACTIONS.LOAD_WALL_POST_CONTENT: {
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: state.wall.posts?.map(post => {
            const matched = data.id === post.id;

            console.log({ post, data });

            if (!matched) {
              return post;
            }

            return {
              ...post,
              contentItems: post.contentItems?.map((item, key) =>
                data.key === key
                  ? { ...(item ?? {}), ...(data.contentItem ?? {}) }
                  : item
              )
            };
          })
        }
      };
    }
    case ACTIONS.LOAD_USER_DATA: {
      return {
        ...state,
        profile: data
      };
    }
    case ACTIONS.LOAD_USER_AVATAR: {
      return {
        ...state,
        profile: {
          ...state.profile,
          avatar: data
        }
      };
    }
    case ACTIONS.UPDATE_USER_PROFILE: {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...data
        }
      };
    }
    case ACTIONS.UPDATE_WALL_POST: {
      const { data: updatedPost } = action;
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: state.wall.posts.map(post =>
            updatedPost.postID === post.id
              ? {
                  ...post,
                  ...updatedPost.data
                }
              : post
          )
        }
      };
    }
    case ACTIONS.PIN_WALL_POST: {
      return {
        ...state,
        wall: {
          ...state.wall,
          pinnedPost: { ...data, pinned: true }
        }
      };
    }
    case ACTIONS.RESET_USER_WALL: {
      return { ...state, wall: INITIAL_STATE.wall };
    }
    default:
      return state;
  }
};

export default user;
