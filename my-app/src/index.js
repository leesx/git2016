import React from 'react'
import { render } from 'react-dom'
import { Router, Route,IndexRoute, Link, browserHistory } from 'react-router'
import withExampleBasename from './withExampleBasename'

import App from './App';
import NoMatch from './NoMatch';
import './index.css';

import Calendar from './components/Calendar';
import ScrollBarDemo from './components/ScrollBarDemo';
import LightBoxDemo from './components/LightBox';
import MaskDemo from './components/MaskDemo';

render((
    // withExampleBasename(browserHistory, __dirname)
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="calendar" component={Calendar}/>
      <Route path="scrollbar" component={ScrollBarDemo}/>
      <Route path="lightbox" component={LightBoxDemo}/>
      <Route path="maskdemo" component={MaskDemo}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))
