
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import './index.css';
import { connect, Provider } from 'react-redux'
import { composeWithDevTools } from 'remote-redux-devtools'

//Redux
const MESSAGES = 'MESSAGES',
  RESULT = 'RESULT',
  CLEAR = 'CLEAR';

const addMessage = (message) => ({
  type: MESSAGES,
  message
});

const showResult = () => ({
  type: RESULT
});

const clear = () => ({
  type: CLEAR
});

const INTIAL_STATE = ({
  messages: [],
  result: 0,
  reset: false,
  parser: '' //--123+ parse to messages:['-', '-123'], parser: '+'
});

const calculatorReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case MESSAGES:
      let messages = [...state.messages];
      let parser = state.parser;
      parser += action.message;
      //reset to last operator (case: +/* followed by any operator, or - followed by +*/)
      if (/^[+/*][+/*-]/.test(parser) || /^-[+/*]/.test(parser)) {
        parser = parser.substr(1);
        //reset to last operator (case: -- foloweed by any operator)
      } else if (/^--[+/*-]/.test(parser)) {
        parser = parser.substr(2);
        //meet condition for parsing, ends with at least one digit and an operator
      } else if (/\d+[+*/-]$/.test(parser)) {
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
      let result = 1;
      return { ...state, result: result };
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
    reset: state.reset,
    parser: state.parser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewMessage: (message) => dispatch(addMessage(message)),
    updateResult: () => { dispatch(showResult()) },
    reset: () => dispatch(clear())
  }
}

//React
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.resetHandler = this.resetHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  resetHandler = () => {
    this.props.reset();
  }

  clickHandler = (e) => {
    this.props.addNewMessage(e.target.value);
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

          <button id="equals" onClick={this.clickHandler}>=</button>
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