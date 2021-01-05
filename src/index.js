import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
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
