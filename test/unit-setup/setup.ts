import { setupTscVersions } from './getTscVersions';

//this file is run by jest on setup --> see ../../jest.config.js["globalSetup"]

//eslint-disable-next-line import/no-default-export
export default () => Promise.all([setupTscVersions()]);
