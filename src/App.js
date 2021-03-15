import React, { useReducer } from 'react';
import './App.css';

const stateMachine = {
  initial: 'initial',
  states: {
    initial: { on: { next: 'loadingModel' } },
    loadingModel: { on: { next: 'awaitingUpload' } },
    awaitingUpload: { on: { next: 'ready' } },
    ready: { on: { next: 'classifying' } },
    classifying: { on: { next: 'complete' } },
    complete: { on: { next: 'awaitingUpload' } }
  }
}

const reducer = (currentState, event) => stateMachine.states[currentState].on[event] || stateMachine.initial;

function App() {
  const [state, dispatch] = useReducer(reducer, stateMachine.initial);
  const next = () => dispatch('next')

  const buttonProps = {
    initial: { text: 'Load Model', action: () => {} }, 
    loadingModel: { text: 'Loading Model', action: () => {} }, 
    awaitingUpload: { text: 'Upload Photo', action: () => {} }, 
    ready: { text: 'Identify', action: () => {} }, 
    classifying: { text: 'Identifying', action: () => {} }, 
    complete: { text: 'Reset', action: () => {} }
  }

  return (
    <div>
      <button onClick={buttonProps[state].action}>{buttonProps[state].text}</button>
    </div>
  );
}

export default App;
