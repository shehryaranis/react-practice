import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
var TextAreaCounter = React.createClass({
    propTypes: {    text: React.PropTypes.string,
      },
  getDefaultProps: function() {
        return {      text: '',
          };
          },
  render: function() {
        return React.DOM.div(null,
              React.DOM.textarea({
                        defaultValue: this.props.text,
                            }),
                                  React.DOM.h3(null, this.props.text.length)    );
                                  } 
});
ReactDOM.render(
    React.createElement(TextAreaCounter,
     {    text: "Bob",
      }),
        document.getElementById("root") 
); 
