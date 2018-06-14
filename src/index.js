import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import {Clock} from './App';
import {GetDatabaseInfo} from './App';
import {GetVerse} from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<GetVerse />, document.getElementById('verses'));
registerServiceWorker();
