import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <div className='number-group'>
        <button id="seven">7</button>
        <button id="eight">8</button>
        <button id="nine">9</button>
        <button id="four">4</button>
        <button id="five">5</button>
        <button id="six">6</button>
        <button id="one">1</button>
        <button id="two">2</button>
        <button id="three">3</button>
        <button id="zero">0</button>
        <button id="dot">.</button>
      </div>
    )
  }
}

class Number extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <Presentational />;
  }

};

ReactDOM.render(
  <Presentational />,
  document.getElementById('root'))