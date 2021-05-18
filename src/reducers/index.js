import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import AuthReducer from "./AuthReducer";
import TipReducer from "./TipReducer";

const reducers = combineReducers({
  user: UserReducer,
  auth: AuthReducer,
  tip: TipReducer
});

export default reducers;
