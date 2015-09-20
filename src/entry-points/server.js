import createRoutes    from '../routes';
import { match }       from 'react-router';
import createLocation  from 'history/lib/createLocation';

export Root           from '../containers/Root';
export configureStore from '../stores';
export { fetchComponentData } from '../utils';

const routes = createRoutes();

export function route (url) {
  const location = createLocation(url);

  return new Promise((resolve, reject) => {
    match({ routes, location }, (err, redirectLocation, renderProps) => {
      if (err) {
        reject([500], err);
      } else if (redirectLocation) {
        reject([301, redirectLocation]);
      } else if (renderProps === null) {
        reject([404]);
      } else {
        resolve(renderProps);
      }
    });
  });
}
