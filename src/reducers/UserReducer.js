import { ACTIONS } from "../actions/UserActions";

const INITIAL_STATE = {
  wall: {
    posts: [],
    page: -1, // Helpful for determining whether or not the wall was loaded at all
    totalPages: 0
  },
  profile: {}
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_USER_WALL: {
      const { data } = action;
      return {
        ...state,
        wall: {
          ...state.wall,
          posts: [...state.wall.posts, ...data.posts],
          page: data.page
        }
      };
    }
    case ACTIONS.LOAD_USER_WALL_TOTAL_PAGES: {
      const { data } = action;
      console.log("Total pages:", data);
      return {
        ...state,
        wall: {
          ...state.wall,
          totalPages: data
        }
      };
    }
    case ACTIONS.LOAD_USER_DATA: {
      const { data } = action;
      return {
        ...state,
        profile: data
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
