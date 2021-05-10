import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Redux

//React
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 0
    }
  }
  render() {

    return (
      <div className='number-group'>
        <div id="box">
          <div id="formula">13123-2+2=345</div>
          <div id="display">{this.state.display}</div>
        </div>
        <button id="clear">AC</button>
        <button id="divide">/</button>
        <button id="multiply">*</button>

        <button id="seven">7</button>
        <button id="eight">8</button>
        <button id="nine">9</button>
        <button id="add">+</button>

        <button id="four">4</button>
        <button id="five">5</button>
        <button id="six">6</button>
        <button id="subtract">-</button>

        <button id="one">1</button>
        <button id="two">2</button>
        <button id="three">3</button>

        <button id="equals">=</button>
        <button id="zero">0</button>
        <button id="decimal">.</button>

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