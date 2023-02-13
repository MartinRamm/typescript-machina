import packageJson from '../../package.json';
import fs from 'fs';

//for some reason, saving the values to globalThis is flaky...
const path = '/tmp/tsc-versions.json';

const minTscVersion: string | null = packageJson?.peerDependencies?.typescript;
if (!minTscVersion || !minTscVersion.match(/^>=[1-9][0-9]*\.[0-9]+\.[0-9]+$/)) {
  throw new Error('Unexpected value in (package.json).peerDependencies.typescript');
}
const [packageJsonMajorTscVersion, packageJsonMinorTscVersion] = minTscVersion
  .substring(2)
  .split('.')
  .map(num => Number.parseInt(num)) as [number, number, number];

if (Number.isNaN(packageJsonMajorTscVersion) || Number.isNaN(packageJsonMinorTscVersion)) {
  throw new Error(`Couldn't convert minTscVersion "${minTscVersion}" to number`);
}

export const setupTscVersions = () =>
  fetch('https://registry.npmjs.org/typescript')
    .then(
      response =>
        response.json() as Promise<{
          //eslint-disable-next-line @typescript-eslint/naming-convention
          'dist-tags': Record<'beta' | 'next', string>;
          versions: string[];
        }>
    )
    .then(json => [
      json['dist-tags']['beta'],
      json['dist-tags']['next'],
      ...Object.keys(json.versions)
        .filter(version => {
          if (version.match(/^[1-9][0-9]*\.[0-9]+\.[0-9]+$/)) {
            const [major, minor] = version.split('.').map(num => Number.parseInt(num)) as [number, number, number];
            return (
              major > packageJsonMajorTscVersion ||
              (major === packageJsonMajorTscVersion && minor >= packageJsonMinorTscVersion)
            );
          }
          return false;
        })
        .sort()
        .reverse(),
    ])
    .then(versions => {
      console.log(`successfully fetched ${versions.length} tsc versions`);
      return fs.promises.writeFile(path, JSON.stringify(versions));
    });

export const getTscVersions = () => {
  const content = fs.readFileSync(path, 'utf-8');
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const versions = JSON.parse(content);
  if (!Array.isArray(versions) || versions.length <= 0) {
    throw new Error("Couldn't load versions from file");
  }
  return versions as string[];
};
