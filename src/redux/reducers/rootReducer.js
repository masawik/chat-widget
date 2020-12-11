import {combineReducers} from "redux";
import messages from "./messages";
import userSettings from "./userSettings";
import status from './status'

export default combineReducers({
  messages,
  user: userSettings,
  status
})