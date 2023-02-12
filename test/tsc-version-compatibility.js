const { spawn } = require('child_process');

fetch('https://registry.npmjs.org/typescript')
  .then(response => response.json())
  .then(json => [
    json['dist-tags']['beta'],
    json['dist-tags']['next'],
    ...Object.keys(json.versions)
      .filter(version => {
        if (version.match(/^[1-9][0-9]*\.[0-9]+\.[0-9]+$/)) {
          const [major, minor] = version.split('.').map(num => Number.parseInt(num));
          return major > 4 || (major === 4 && minor >= 7);
        }
        return false;
      })
      .sort()
      .reverse(),
  ])
  .then(versions =>
    versions.map(
      version =>
        new Promise(resolve => {
          spawn('pnpm', `--package typescript@${version} dlx tsc --noEmit --project tsconfig.json`.split(' ')).on(
            'close',
            code => resolve([version, code === 0])
          );
        })
    )
  )
  .then(promises => Promise.all(promises))
  .then(entries => Object.fromEntries(entries))
  .then(console.log)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
