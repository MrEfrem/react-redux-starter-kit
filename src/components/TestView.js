import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as CounterActions from '../reducers/counter';

const mapStateToProps = (state) => ({
  counter : state.counter
});
export default class TestView extends React.Component {
  static propTypes = {
    counter  : React.PropTypes.number
  };

  constructor () {
    super();
  }

  static needs = [
    CounterActions.incCounter
  ];

  render () {
    return (
      <div className="container text-center">
        <h1>Page Test</h1>
        <h2>Counter: {this.props.counter}</h2>
        <br/><br/>
        <Link to="/">Home page</Link>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TestView);
