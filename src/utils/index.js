export function createConstants (...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer (initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action) : state;
  };
}

export function fetchComponentData (dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
    return (current.needs || [])
      .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
      .concat(prev);
  }, []);

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}
