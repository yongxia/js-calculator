
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import './style.css';
import { connect, Provider } from 'react-redux'

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
  messages: [], // store operators and numbers
  result: 0,
  parser: '' //--123+ parse to messages:['-', '-123'], parser: '+'
});


const calculatorReducer = (state = INTIAL_STATE, action) => {
  let messages = [...state.messages];
  let parser = state.parser;
  switch (action.type) {
    case MESSAGES:
      if (messages.includes('=')) {
        if (/[+*/-]/.test(action.message)) { //user previous result
          messages = [state.result];
        } else {
          messages = []; //new calculation
        }
      }
      parser += action.message;
      //reset to last operator (case: +/* followed by any operator, or - followed by +*/)
      if (/^[+/*-][+/*]/.test(parser)) {
        parser = parser.substr(1);
        //reset to last operator (case: -- foloweed by any operator)
      } else if (/^[+*/-]-[+/*-]/.test(parser)) {
        parser = parser.substr(2);
      } else if (! /\d+[+*/-]$/.test(parser)) {
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
          messages.push(parser.charAt(0));
          parser = parser.substring(1); //consume operator, '--1.23+' => '-1.23+' , messages:['-']
        }
        //continue consume parser number part, messages: ['-',-1.23], parser: '+'
        if (parser.includes('.')) {
          messages.push(parseFloat(parser.substring(0, parser.length - 1)));
        } else {
          messages.push(parseInt(parser.substring(0, parser.length - 1)));
        }
        //update parser for next parse
        parser = parser.substring(parser.length - 1);
      }
      return { ...state, messages: messages, parser: parser, result: parser };
    case RESULT:
      //consume remaining parser if any
      if (/^[+*/-]/.test(parser)) {
        messages.push(parser.charAt(0));
        parser = parser.substring(1);
        if (parser.length > 0) {
          if (parser.includes('.')) {
            messages.push(parseFloat(parser));
          } else {
            messages.push(parseInt(parser));
          }
          parser = '';
        }
      }
      // if there is no left hand for first operator in array, use 0
      if (typeof messages[0] !== 'number') {
        messages.unshift(0);
      }
      // no right hand number return current state
      if (messages.length <= 2 || typeof messages[messages.length - 1] !== 'number') return state;

      //calulate result Formula/Expression Logic
      let reduced = [...messages];
      while (reduced.includes('*') || reduced.includes('/')) {
        let i = 1; // always start from beging as the array changes
        while (i < reduced.length - 1) {
          if (/[*|/]/.test(reduced[i])) {
            let left = reduced[i - 1];
            let operator = reduced[i];
            let right = reduced[i + 1];
            let result = operator === '*' ? Math.round(left * right * 10000) / 10000 : Math.round(left / right * 10000) / 10000;
            reduced.splice(i - 1, 3, result);
          }
          i++;
        }
        console.log('reduced', reduced);
      }

      while (reduced.includes('+') || reduced.includes('-')) {
        let i = 1;
        while (i < reduced.length - 1) {
          if (/[+|-]/.test(reduced[i])) {
            let left = reduced[i - 1];
            let operator = reduced[i];
            let right = reduced[i + 1];
            let result = operator === '+' ? Math.round((left + right) * 10000) / 10000 : Math.round((left - right) * 10000) / 10000;
            reduced.splice(i - 1, 3, result)
          }
        }
        i++;
        console.log('reduced', reduced);
      }
      let result = reduced[0];
      messages.push('=', result);
      return { ...state, messages: messages, parser: '', result: result };
    case CLEAR:
      return INTIAL_STATE;
    default:
      return state;
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
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
            <div id="formula">{this.props.messages.join("") + this.props.parser}</div>
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