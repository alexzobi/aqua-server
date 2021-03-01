const fs = require('fs');
const path = require('path');

type ServiceName = 'lights'
  | 'users'
  | 'pumps'
  | 'heaters'
  | 'sensors'
  | 'tanks'
  | 'misc'

type Data = any[] | {[key: string]: any}
type WriteFileCallback = (err) => Promise<void>;
type ReadFileCallback = () => Promise<Data>;

class SettingsService {
  async writeToSettings(
    serviceName: ServiceName,
    data: Data,
    callback?: WriteFileCallback
  ) {
    const stringifiedData = JSON.stringify(data, null, 2);

    return fs.writeFileSync(
      path.join(__dirname, `../../settings/${serviceName}.json`),
      stringifiedData,
      callback
        ? callback
        : (err => { if (err) throw err; })
    );
  }

  async readFromSettings(
    serviceName: ServiceName,
    callback?: WriteFileCallback
  ) {
    const data = await fs.readFileSync(
      path.join(__dirname, `../../settings/${serviceName}.json`),
      'utf8',
      callback
        ? callback
        : (err, data) => {
          if (err) throw err;

          return data;
        }
      )

    return JSON.parse(data);
  }
}

module.exports = SettingsService;