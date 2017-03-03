import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// First Hello World On react
ReactDOM.render(
  React.DOM.h1({
    style:{
      color:'blue',
      fontFamily:'Verdana',
      background:'pink',
    }
  },
  "Hello World!"),
  
  document.getElementById("root")
);