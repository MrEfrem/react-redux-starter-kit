import config  from '../../config';
import makeWebPackConfig from './client-base';

const publicPath = config.get('webpack_public_path');

export default makeWebPackConfig(publicPath, 'watch');
