export function renderDevTools (store) {
  if (__DEBUG__) {
    return (
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} visibleOnLoad/>
      </DebugPanel>
    );
  }
  return null;
}