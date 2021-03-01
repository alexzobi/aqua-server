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
type ReadFileCallback = (err, data?) => void;

class SettingsService {
  async writeToSettings(
    serviceName: ServiceName,
    data: Data,
    callback?: WriteFileCallback
  ) {
    const stringifiedData = JSON.stringify(data, null, 2);

    return fs.writeFileSync(
      path.join(__dirname, `../../settings/${serviceName}.json`),
      stringifiedData
    );
  }

  async readFromSettings(
    serviceName: ServiceName,
    callback?: ReadFileCallback
  ) {
    try {
      const [err, data] = await fs.readFileSync(
        path.join(__dirname, `../../settings/${serviceName}.json`),
        'utf8'
      );

      if (callback) return callback(null, JSON.parse(data));

      return JSON.parse(data);
    } catch (err) {
      if (callback) return callback(err);
      if (err.code === 'ENOENT') return {};

      throw err;
    }
  }
}

module.exports = SettingsService;