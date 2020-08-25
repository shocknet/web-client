import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const store = window.__REDUX_DEVTOOLS_EXTENSION__
  ? createStore(
      rootReducer,
      compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
    )
  : createStore(rootReducer, applyMiddleware(thunk));

export default store;
