import { describe, expect, test } from '@jest/globals';
import { spawn } from 'child_process';
import { getMachinaVersions } from '../unit-setup/getMachinaVersions';

describe('machina version compatibility', () => {
  getMachinaVersions().forEach(version =>
    test.concurrent(
      version,
      async () => {
        const exitCode = await new Promise(resolve => {
          const child = spawn(
            'pnpm',
            `--package machina@${version} dlx pnpm run test-without-compatibility`.split(' ')
          );
          let stdout = '';
          //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          child.stdout.on('data', line => (stdout += `\n${JSON.stringify(line.toString())}`));
          //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          child.stderr.on('data', line => (stdout += `\n${JSON.stringify(line.toString())}`));

          child.on('close', code => {
            if (code !== 0) {
              console.log('machina version  compatibility', version, stdout);
            }
            resolve(code);
          });
        });

        expect(exitCode).toBe(0);
      },
      60 * 5 * 1_000
    )
  );
});
