import { ACTIONS } from "../actions/TipActions";

const INITIAL_STATE = {
  paymentRequest: null
};

const tip = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_PAYMENT_REQUEST: {
      const { data } = action;
      return {
        ...state,
        paymentRequest: data
      };
    }
    case ACTIONS.RESET_PAYMENT_REQUEST: {
      return {
        ...state,
        paymentRequest: null
      };
    }
    case ACTIONS.OPEN_TIP_MODAL: {
      const { data } = action;

      return {
        ...state,
        modalOpen: true,
        metadata: data
      };
    }
    case ACTIONS.CLOSE_TIP_MODAL: {
      return {
        ...state,
        modalOpen: false,
        metadata: {}
      };
    }
    case ACTIONS.UPDATE_METADATA: {
      const { data } = action;

      return {
        ...state,
        metadata: data
      };
    }
    default:
      return state;
  }
};

export default tip;
