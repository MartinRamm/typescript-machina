import { setupTscVersions } from './getTscVersions';

//eslint-disable-next-line import/no-default-export
export default () => Promise.all([setupTscVersions()]);
