import { createReducer } from 'utils';

// normally this would be imported from /constants, but in trying to keep
// this starter kit as easy to customize as possibility we'll just define
// the constant here.
const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
const COUNTER_SET = 'COUNTER_SET';

export function setCounter() {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const state = getState();
      if (state.counter === 0) {
        resolve({
          type: COUNTER_SET,
          value: 6
        });
      } else {
        resolve();
      }
    }).then(action => {
      if (action) {
        dispatch(action);
      }
    });
  };
}

export function incCounter() {
  return (dispatch) => {
    return new Promise((resolve) => {
      resolve();
    }).then(action => dispatch({
      type: COUNTER_INCREMENT
    }));
  };
}

const initialState = 0;

export default createReducer(initialState, {
  [COUNTER_INCREMENT] : (state) => {
    return state + 1;
  },
  [COUNTER_SET] : (state, action) => {
    return action.value;
  }
});
