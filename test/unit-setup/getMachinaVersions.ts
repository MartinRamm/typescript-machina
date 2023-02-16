import packageJson from '../../package.json';
import fs from 'fs';

//for some reason, saving the values to globalThis is flaky...
const path = '/tmp/machina-versions.json';

const minMachinaVersion: string | null = packageJson?.peerDependencies?.machina;
if (!minMachinaVersion || !minMachinaVersion.match(/^>=[1-9][0-9]*\.[0-9]+\.[0-9]+$/)) {
  throw new Error('Unexpected value in (package.json).peerDependencies.machina');
}
const [packageJsonMajorMachinaVersion, packageJsonMinorMachinaVersion] = minMachinaVersion
  .substring(2)
  .split('.')
  .map(num => Number.parseInt(num)) as [number, number, number];

if (Number.isNaN(packageJsonMajorMachinaVersion) || Number.isNaN(packageJsonMinorMachinaVersion)) {
  throw new Error(`Couldn't convert minMachinaVersion "${minMachinaVersion}" to number`);
}

export const setupMachinaVersions = () =>
  fetch('https://registry.npmjs.org/machina')
    .then(
      response =>
        response.json() as Promise<{
          versions: string[];
        }>
    )
    .then(json =>
      Object.keys(json.versions)
        .filter(version => {
          if (version.match(/^[1-9][0-9]*\.[0-9]+\.[0-9]+$/)) {
            const [major, minor] = version.split('.').map(num => Number.parseInt(num)) as [number, number, number];
            return (
              major > packageJsonMajorMachinaVersion ||
              (major === packageJsonMajorMachinaVersion && minor >= packageJsonMinorMachinaVersion)
            );
          }
          return false;
        })
        .sort()
        .reverse()
    )
    .then(versions => {
      console.log(`successfully fetched ${versions.length} machina versions`);
      return fs.promises.writeFile(path, JSON.stringify(versions));
    });

export const getMachinaVersions = () => {
  const content = fs.readFileSync(path, 'utf-8');
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const versions = JSON.parse(content);
  if (!Array.isArray(versions) || versions.length <= 0) {
    throw new Error("Couldn't load versions from file");
  }
  return versions as string[];
};
