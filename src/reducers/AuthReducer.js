import { ACTIONS } from "../actions/AuthActions";

const INITIAL_STATE = {
  pair: {}
};

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_GUN_PAIR: {
      const { data } = action;
      return {
        ...state,
        pair: data
      };
    }
    default:
      return state;
  }
};

export default auth;
