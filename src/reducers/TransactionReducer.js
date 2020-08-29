import { ACTIONS } from "../actions/TransactionActions";

const INITIAL_STATE = {
  paymentRequest: null
};

const transaction = (state = INITIAL_STATE, action) => {
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
    default:
      return state;
  }
};

export default transaction;
