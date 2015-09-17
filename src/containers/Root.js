import React        from 'react';
import { Provider } from 'react-redux';
import { DevTools, LogMonitor, DebugPanel } from 'redux-devtools/lib/react';

export default class Root extends React.Component {

  // routerHistory is provided by the client bundle to determine which
  // history to use (memory, hash, browser). routingContext, on the other hand,
  // is provided by the server and provides a full router state.
  static propTypes = {
    store          : React.PropTypes.object.isRequired,
    children       : React.PropTypes.element.isRequired
  }

  constructor () {
    super();
  }

  renderDevTools () {
    if (__DEBUG_NW__) {
      if (__CLIENT__) {
        const win = window.open(
          null,
          'redux-devtools', // give it a name so it reuses the same window
          'menubar=no,location=no,resizable=yes,scrollbars=no,status=no'
        );

        // reload in case it's reusing the same window with the old content
        win.location.reload();

        // wait a little bit for it to reload, then render
        setTimeout(() => {
          React.render(
            <DebugPanel top right bottom left>
              <DevTools store={this.props.store} monitor={LogMonitor}/>
            </DebugPanel>
            , win.document.body);
        }, 10);
      }
      return null;
    } else {
      return (
        <DebugPanel top right bottom key='debugPanel'>
          <DevTools store={this.props.store} monitor={LogMonitor} />
        </DebugPanel>
      );
    }
  }

  render () {
    let debugTools = null;

    if (__DEBUG__) {
      debugTools = this.renderDevTools();
    }

    return (
      <div>
        {debugTools}
        <Provider store={this.props.store} key="provider">
          {this.props.children}
        </Provider>
      </div>
    );
  }
}
