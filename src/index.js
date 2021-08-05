
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { connect, Provider } from 'react-redux';

import './style.css';

//Redux
const MESSAGES = 'MESSAGES',
  RESULT = 'RESULT',
  CLEAR = 'CLEAR';

const addMessage = message => ({
  type: MESSAGES,
  message
});

const addResult = () => ({
  type: RESULT
});

const clear = () => ({
  type: CLEAR
});

const INTIAL_STATE = ({
  equation: [], // store operators and numbers
  result: 0,
  parser: ''
});

const isOperator = /[+*/-]/;
const startsWithOperatorFollowedByNonNegative = /^[+/*-][+/*]/;
const startsWithOperatorFollowedByNegativeAndOperator = /^[+*/-]-[+/*-]/;
const endsWithOperator = /\d+[+*/-]$/;

const calculatorReducer = (state = INTIAL_STATE, action) => {
  let equation = [...state.equation];
  let parser = state.parser;
  switch (action.type) {
    case MESSAGES:
      parser += action.message;
      //case: use previous result
      if (equation.includes('=')) {
        equation = isOperator.test(action.message) ? [state.result] : [];
      }
      //case: reset to last operator 
      if (startsWithOperatorFollowedByNonNegative.test(parser)) { //(+/-* followed by +/*)
        parser = parser.substring(1);
      } else if (startsWithOperatorFollowedByNegativeAndOperator.test(parser)) {
        parser = parser.substring(2);
      } else if (!endsWithOperator.test(parser)) {
        // hanlde multiple zeros in beging of a number, allow 0. for float
        if (/^[+*/]?-?0+$/.test(parser)) {
          parser = parser.replace(/0+/, '0');
        } else if (/^[+*/]?-?0+[1-9]$/.test(parser)) {
          parser = parser.replace(/0+/, '');
        }
        // only show one dot for float number
        if ((parser.match(/\./g) || []).length > 1) {
          parser = parser.substring(0, parser.length - 1);
        }
      } else {
        //meet condition for parsing, ends with at least one digit and an operator
        //at the very beginng, there might not be an operator in parser
        if (/^[+/*-]/.test(parser)) {
          equation.push(parser[0]);
          parser = parser.substring(1); //parse operator, '--1.23+' => '-1.23+', ['-']
        }
        //parse number part
        equation.push(parser.substring(0, parser.length - 1));
        //update parser for next parse
        parser = parser[parser.length - 1];
      }
      return { ...state, equation: equation, parser: parser, result: parser };
    case RESULT:
      //parse remaining if any
      if (/^[+*/-]/.test(parser)) {
        equation.push(parser[0]);
        parser = parser.substring(1);
        if (parser.length > 0) {
          equation.push(parser);
          parser = '';
        }
      }
      // no left or right hand number return current state
      if (equation.length <= 2 || !/\d$/.test(equation[equation.length - 1])) return state;

      let expression = equation.join(' ');
      // no left hand for first operator in expression, add 0
      if (typeof equation[0] !== 'number') {
        expression = '0 + ' + expression;
      }
      let result = Math.round(eval(expression) * 10000) / 10000;
      equation.push('=', result);
      return { ...state, equation: equation, parser: '', result: result };
    case CLEAR:
      return INTIAL_STATE;
    default:
      return state;
  }
}

const mapStateToProps = state => {
  return {
    equation: state.equation,
    result: state.result,
    parser: state.parser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewMessage: message => { dispatch(addMessage(message)) },
    updateResult: () => { dispatch(addResult()) },
    reset: () => { dispatch(clear()) }
  }
}

//React
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.resetHandler = this.resetHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.clickEqualsHandler = this.clickEqualsHandler.bind(this);
  }

  resetHandler = () => {
    this.props.reset();
  }

  clickHandler = e => {
    this.props.addNewMessage(e.target.value);
  }

  clickEqualsHandler = () => {
    this.props.updateResult();
  }

  render() {

    return (
      <div className="container">
        <div className='box-group'>
          <div className="screen">
            <div id="formula">{this.props.equation.join('') + this.props.parser}</div>
            <div id="display">{this.props.result}</div>
          </div>
          <button id="clear" onClick={this.resetHandler}>AC</button>
          <button id="divide" onClick={this.clickHandler} value="/">/</button>
          <button id="multiply" onClick={this.clickHandler} value="*">*</button>

          <button id="seven" onClick={this.clickHandler} value="7">7</button>
          <button id="eight" onClick={this.clickHandler} value="8">8</button>
          <button id="nine" onClick={this.clickHandler} value="9">9</button>
          <button id="add" onClick={this.clickHandler} value="+">+</button>

          <button id="four" onClick={this.clickHandler} value="4">4</button>
          <button id="five" onClick={this.clickHandler} value="5">5</button>
          <button id="six" onClick={this.clickHandler} value="6">6</button>
          <button id="subtract" onClick={this.clickHandler} value="-">-</button>

          <button id="one" onClick={this.clickHandler} value="1">1</button>
          <button id="two" onClick={this.clickHandler} value="2">2</button>
          <button id="three" onClick={this.clickHandler} value="3">3</button>

          <button id="equals" onClick={this.clickEqualsHandler}>=</button>
          <button id="zero" onClick={this.clickHandler} value="0">0</button>
          <button id="decimal" onClick={this.clickHandler} value=".">.</button>
        </div>
        <p>Coded by Yong Xia <a href="https://github.com/yongxia/js-calculator" target="_blank" rel="noreferrer"><i className="fa fa-github"></i> Github</a></p>
      </div>
    )
  }
}

//react-dedux
const store = createStore(calculatorReducer, devToolsEnhancer());
const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class CalculatorWrapper extends React.Component {
  render = () => (
    <Provider store={store}>
      <Container />
    </Provider>
  )
}

ReactDOM.render(<CalculatorWrapper />, document.getElementById('root'))