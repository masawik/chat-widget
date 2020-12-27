import {combineReducers} from "redux";
import messages from "./messages";
import userSettings from "./userSettings";
import requestStatus from './requestStatus'
import chatUsersCounter from "./chatUsersCounter";
import serverStatus from "./serverStatus";

export default combineReducers({
  messages,
  user: userSettings,
  requestStatus,
  chatUsersCounter,
  serverStatus
})