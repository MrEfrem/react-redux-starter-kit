import { createReducer } from '../utils';

// normally this would be imported from /constants, but in trying to keep
// this starter kit as easy to customize as possibility we'll just define
// the constant here.
const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
const COUNTER_SET = 'COUNTER_SET';

export function setCounter() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.counter === 0) {
      dispatch({
        type: COUNTER_SET,
        value: 6
      });
    }
  };
}

export function incCounter() {
  return {
    type: COUNTER_INCREMENT
  };
}

const initialState = 0;

export default createReducer(initialState, {
  [COUNTER_INCREMENT] : (state) => state + 1,
  [COUNTER_SET] : (state, action) => action.value
});
