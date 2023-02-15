import { describe, expect, test } from '@jest/globals';
import { spawn } from 'child_process';
import { getTscVersions } from '../unit-setup/getTscVersions';

describe('typescript version compatibility', () => {
  getTscVersions().forEach(version =>
    test.concurrent(
      version,
      async () => {
        const exitCode = await new Promise(resolve => {
          const child = spawn(
            'pnpm',
            `--package typescript@${version} dlx tsc --noEmit --project tsconfig.json`.split(' ')
          );

          let stdout = '';
          //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          child.stdout.on('data', line => (stdout += `\n${JSON.stringify(line.toString())}`));
          //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          child.stderr.on('data', line => (stdout += `\n${JSON.stringify(line.toString())}`));

          child.on('close', code => {
            if (code !== 0) {
              console.log('tsc version compatibility', version, stdout);
            }
            resolve(code);
          });
        });

        expect(exitCode).toBe(0);
      },
      60 * 1_000
    )
  );
});
