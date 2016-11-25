import React from 'react'
import { render } from 'react-dom'
import { Router, Route,IndexRoute, Link, browserHistory } from 'react-router'
import withExampleBasename from './withExampleBasename'

import App from './App';
import NoMatch from './NoMatch';
import './index.css';
import './style/antd.css';

import Calendar from './components/Calendar';  // 日历
import ScrollBarDemo from './components/ScrollBarDemo'; // scrollBar 美化
import LightBoxDemo from './components/LightBox';
import MaskDemo from './components/MaskDemo';
import ScrollDemo from './components/Scroll';// 简单的滚动加载更多
import SortableDemo from './components/Sortable';
import Containment from './components/Sortable/containment';
import Vertical from './components/Sortable/vertical';

render((
    // withExampleBasename(browserHistory, __dirname)
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="calendar" component={Calendar}/>
      <Route path="scrollbar" component={ScrollBarDemo}/>
      <Route path="lightbox" component={LightBoxDemo}/>
      <Route path="maskdemo" component={MaskDemo}/>
      <Route path="scroll" component={ScrollDemo}/>
      <Route path="sortable" component={SortableDemo}>
          <Route path="containment" component={Containment} />
          <Route path="vertical" component={Vertical} />
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))
