// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from '@vitjs/runtime';
import { Router, history } from '@vitjs/runtime';

import '../global.ts';
import '../global.less';

import getRoutes from './routes';


const DefaultApp: React.FC = () => {
  return (
    <React.StrictMode>
      <Router history={history}>
        {renderRoutes({ routes: getRoutes() })}
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<DefaultApp />, document.getElementById('root'));
