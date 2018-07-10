import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import hashHistory from './history';
import App from './public/component';
import index from './pages/HouseIndex';

// 测试页
const test = (location, cb) => {
  require.ensure([], (require) => {
    cb(null, require('./pages/Test'))
  }, 'test')
}

/* 进入路由的判断 */
function isLogin(nextState, replaceState) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    replaceState('');
    // hashHistory.push('Index')
  }
}

export default () => (
  <Router history={hashHistory}>
    <Route
      path="/"
      component={App}
      onEnter={isLogin}
      onChange={(prevState, nextState) => {
        document.getElementById('root').scrollTo(0, 0);
      }}
    >
      <IndexRoute component={index} />
      <Route path="/test" getComponent={test} />
    </Route>
  </Router>
);
