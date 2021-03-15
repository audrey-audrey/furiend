import React, { useReducer, useState, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tf from '@tensorflow/tfjs'
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
  tf.setBackend("cpu"); 

  const [state, dispatch] = useReducer(reducer, stateMachine.initial);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const imageRef = useRef();

  const next = () => dispatch('next')

  const loadModel = async () => {
    const mobilenetModel = await mobilenet.load();
    setModel(mobilenetModel);
  }

  const handleUpload = e => {
    const {files} = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
      next();
    }
  }

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    console.log({results})
    next();
  }

  const buttonProps = {
    initial: { text: 'Load Model', action: loadModel }, 
    loadingModel: { text: 'Loading Model', action: () => {} }, 
    awaitingUpload: { text: 'Upload Photo', action: () => inputRef.current.click() }, 
    ready: { text: 'Identify', action: () => {} }, 
    classifying: { text: 'Identifying', action: () => {} }, 
    complete: { text: 'Reset', action: () => {} }
  }

  const { showImage = false } = stateMachine.states[state];

  return (
    <div>
      {showImage && <img src={imageURL} alt='upload-preview' ref={imageRef} />}
      <input type='file' accept='image/*' capture='camera' ref={inputRef} onChange={handleUpload} />
      <button onClick={buttonProps[state].action}>{buttonProps[state].text}</button>
    </div>
  );
}

export default App;
