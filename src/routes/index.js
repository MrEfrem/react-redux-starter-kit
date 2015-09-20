import { Route }   from 'react-router';
import React       from 'react';
import CoreLayout  from '../layouts/CoreLayout';
import HomeView    from '../components/HomeView';
import TestView    from '../components/TestView';

export default (onEnter) => {
  return (
    <Route component={CoreLayout}>
      <Route path='/' component={HomeView} onEnter={onEnter}/>
      <Route path='/test' component={TestView} onEnter={onEnter}/>
    </Route>
  );
};
