import React       from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as CounterActions from 'reducers/counter';

// We define mapDispatchToProps where we'd normally use the @connect
// decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapDispatchToProps = (state) => ({
  counter : state.counter
});
export class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    counter  : React.PropTypes.number
  }

  constructor () {
    super();
  }

  static needs = [
    CounterActions.setCounter
  ]

  // normally you'd import an action creator, but I don't want to create
  // a file that you're just going to delete anyways!
  _increment () {
    this.props.dispatch({ type : 'COUNTER_INCREMENT' });
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>Welcome to the React Redux Starter Kit</h1>
        <h2>Sample Counter: {this.props.counter}</h2>
        <button className='btn btn-default'
                onClick={::this._increment}>
          Increment
        </button>
        <br/><br/>
        <Link to="/test">Test page</Link>
      </div>
    );
  }
}

export default connect(mapDispatchToProps)(HomeView);
