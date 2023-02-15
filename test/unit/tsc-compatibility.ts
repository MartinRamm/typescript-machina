import { describe, expect, test } from '@jest/globals';
import { spawn } from 'child_process';
import { getTscVersions } from '../unit-setup/getTscVersions';

describe('tsc-version-compatibility', () => {
  getTscVersions().forEach(version =>
    test.concurrent(version, async () => {
      const exitCode = await new Promise(resolve => {
        const child = spawn(
          'pnpm',
          `--package typescript@${version} dlx tsc --noEmit --project tsconfig.json 2>&1`.split(' ')
        );

        let stdout = '';
        child.stdout.on('data', line => (stdout += `\n${JSON.stringify(line)}`));

        child.on('close', code => {
          if (code !== 0) {
            console.log('tsc-version-compatibility', version, stdout);
          }
          resolve(code);
        });
      });

      expect(exitCode).toBe(0);
    })
  );
});
