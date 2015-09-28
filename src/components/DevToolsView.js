import React from 'react';
import { DevTools, LogMonitor, DebugPanel } from 'redux-devtools/lib/react';

export default class DevToolsView extends React.Component {
  static propTypes = {
    store  : React.PropTypes.object
  };

  render () {
    if (__DEBUG__) {
      return (
        <DebugPanel top right bottom>
          <DevTools store={this.props.store} monitor={LogMonitor} visibleOnLoad/>
        </DebugPanel>
      );
    }
    return null;
  }
}

