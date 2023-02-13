import { describe, expect, test } from '@jest/globals';
import { spawn } from 'child_process';
import { getTscVersions } from '../unit-setup/getTscVersions';

describe('tsc-version-compatibility', () => {
  getTscVersions().forEach(version =>
    test.concurrent(version, async () => {
      const exitCode = await new Promise(resolve => {
        spawn('pnpm', `--package typescript@${version} dlx tsc --noEmit --project tsconfig.json`.split(' ')).on(
          'close',
          code => resolve(code)
        );
      });

      expect(exitCode).toBe(0);
    })
  );
});
