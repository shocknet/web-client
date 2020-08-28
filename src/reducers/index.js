import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import AuthReducer from "./AuthReducer";
import TransactionReducer from "./TransactionReducer";

const reducers = combineReducers({
  user: UserReducer,
  auth: AuthReducer,
  transaction: TransactionReducer
});

export default reducers;
