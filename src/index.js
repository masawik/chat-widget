import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
import reportWebVitals from './reportWebVitals';
import App from './App/App';
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./redux/reducers/rootReducer";
import {Provider} from "react-redux";
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(reduxThunk)))

const app = (
  <Provider store={store}>
      <App/>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
