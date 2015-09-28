import { Route }   from 'react-router';
import React       from 'react';
import App  from '../containers/App';
import HomeView    from '../components/HomeView';
import TestView    from '../components/TestView';

export default (onEnter) => {
  return (
    <Route component={App}>
      <Route path='/' component={HomeView} onEnter={onEnter}/>
      <Route path='/test' component={TestView} onEnter={onEnter}/>
    </Route>
  );
};
