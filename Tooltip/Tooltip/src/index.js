import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

class Tooltip extends React.Component{
  constructor(props){
    super(props)
    this.state = {opacity: false}
    this.toggle = this.toggle.bind(this)

  }
  toggle(){
    const tooltipNode = ReactDOM.findDOMNode(this)
    this.setState({
      opacity: !this.state.opacity,
      top: tooltipNode.offsetTop,
      left: tooltipNode.offsetLeft
    })

  }
  render(){
    const style = {
      zIndex: (this.state.opacity) ? 1000 : -1000,
      opacity: +this.state.opacity,
      top: (this.state.top || 0 )+ 20,
      left: (this.state.left || 0) -30
    }
    return(
      <div style={{display:'inline'}}>
      <span style={{color: 'blue'}}x
      onMouseEnter={this.toggle}
      onMouseOut={this.toggle}>
      {this.props.children}
      <div className="tooltip bottom" style={style} role="tooltip">
        <div className="tooltip-arrow"></div>
        <div className="tooltip-inner">
          {this.props.text}
        </div>
      </div>
      </span>
      </div>
    

 

    )}
}
ReactDOM.render(<div><Tooltip text="The book you'r Reading now">
React Quickly</Tooltip>was published in 2017. its awesome</div>,
document.getElementById('tooltip'))