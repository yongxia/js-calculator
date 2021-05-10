
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import { connect, Provider } from 'react-redux'

//Redux
const MESSAGES = 'MESSAGES';
const RESULT = 'RESULT';
const CLEAR = 'CLEAR';

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
  reset: false
});

const calculatorReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case MESSAGES:
      return { ...state, messages: [...state.messages, action.message] };
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
    reset: state.reset
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewMessage: (message) => dispatch(addMessage(message)),
    updateResult: () => { dispatch(showResult()) },
    reset: () => dispatch(clear()),
  }
}

//React
class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='number-group'>
        <div id="box">
          <div id="formula">{this.props.messages.join("")}</div>
          <div id="display">{this.props.result}</div>
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

//react-dedux
const store = createStore(calculatorReducer);
const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class CalculatorWrapper extends React.Component {
  render = () => (
    <Provider store={store}>
      <Container />
    </Provider>
  )
}

ReactDOM.render(<CalculatorWrapper />, document.getElementById('root'))