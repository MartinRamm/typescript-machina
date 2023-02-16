import { setupTscVersions } from './getTscVersions';
import { setupMachinaVersions } from './getMachinaVersions';
import * as process from 'process';

//this file is run by jest on setup --> see ../../jest.config.js["globalSetup"]

//eslint-disable-next-line import/no-default-export
export default () => {
  if (process.argv.includes('--testPathIgnorePatterns')) {
    console.log('\n\n!!!!Jest globalSetup script ignored, as the argument testPathIgnorePatterns was detected!!!!\n\n');
    return;
  }
  return Promise.all([setupTscVersions(), setupMachinaVersions()]);
};
