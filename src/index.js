
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import './index.css';
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
  messages: [],
  result: 0,
  parser: '' //--123+ parse to messages:['-', '-123'], parser: '+'
});


const calculatorReducer = (state = INTIAL_STATE, action) => {
  let messages = [...state.messages];
  let parser = state.parser;
  switch (action.type) {
    case MESSAGES:
      if (messages.includes('=')) return state; // clear AC to start with a new cacluation
      parser += action.message;
      //reset to last operator (case: +/* followed by any operator, or - followed by +*/)
      if (/^[+/*][+/*-]/.test(parser) || /^-[+/*]/.test(parser)) {
        parser = parser.substr(1);
        //reset to last operator (case: -- foloweed by any operator)
      } else if (/^--[+/*-]/.test(parser)) {
        parser = parser.substr(2);
        // hanlde multiple zeros in beging of a number, allow 0. for float
      } else if (! /\d+[+*/-]$/.test(parser)) {
        if (/^[^1-9]+0+[1-9]$/.test(parser)) {
          parser = parser.replace(/0+/, '');
        } else if (/^[+*/-]+[^1-9]0+\.$/.test(parser)) {
          parser = parser.replace(/0+/, '0');
        }
        // only show one dot for float number
        if (parser.endsWith('..')) {
          parser = parser.replace('..', '.');
        }
        //meet condition for parsing, ends with at least one digit and an operator
      } else {
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
      return { ...state, messages: messages, parser: parser };
    case RESULT:
      if (messages.includes('=')) return state; // clear AC to start with a new cacluation
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
      //calulate result Formula/Expression Logic
      if (messages.length <= 1) return state;
      if (/^[*/]/.test(messages[0])) return state; //click AC to fix the formular no left
      console.log(messages);
      let reducer = [...messages];
      //TODO
      while (reducer.includes('*') || reducer.includes('/')) {
        let i = 1;
        while (i < reducer.length) {
          if (/[*|/]/.test(reducer[i])) {
            let left = reducer[i - 1];
            let operator = reducer[i];
            if (i + 1 === reducer.length) {
              reducer.splice(i - 1, 2, left)
              break;
            } else {
              let right = reducer[i + 1];
              let result = operator === '*' ? left * right : Math.round(left / right * 10000) / 10000;
              reducer.splice(i - 1, 3, result)
            }
          }
          i++;
          console.log('reduced', reducer);
        }
      }
      //TODO
      while (reducer.includes('+') || reducer.includes('-')) {
        let i = 1;
        while (i < reducer.length) {
          if (/[+|-]/.test(reducer[i])) {
            let left = reducer[i - 1];
            let operator = reducer[i];
            if (i + 1 === reducer.length) {
              reducer.splice(i - 1, 2, left)
              break;
            } else {
              let right = reducer[i + 1];
              let result = operator === '+' ? Math.round((left + right) * 10000) / 10000 : Math.round((left - right) * 10000) / 10000;
              reducer.splice(i - 1, 3, result)
            }
          }
          i++;
          console.log('reduced', reducer);
        }
      }
      let result = reducer.reduce((total, num) => { total += num; return total; }, 0);
      messages.push('=', result); // workaround, click AC to recalculator
      parser = '';
      return { ...state, messages: messages, parser: parser, result: result };
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
        <div><p>Coded by Yong Xia</p></div>
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