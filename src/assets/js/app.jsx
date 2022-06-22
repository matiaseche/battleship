import React from 'react';
import ReactDOM from 'react-dom';
import Battleship from './components/Battleship';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<Battleship />, reactAppContainer);
}
