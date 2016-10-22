const fs = require('fs') // File system

// This class handles anything related to the connectionSettings
class ConnectionSettingsController {
  constructor() {
    this.configFileName = 'connections.config'
  }

  // Returns the list of connections
  list(callback) {
    fs.exists(this.configFileName, (exists) => {
      let result = []
      if(exists) {
        let configData = fs.readFileSync(this.configFileName)

        try {
          result = JSON.parse(configData)
        }
        catch (err) {
          console.log('There has been an error parsing your JSON.')
          console.log(err)
        }
      }
      callback(result)
    });
  }

  // Adds an entry to the list of connections
  add(connectionOptions) {
    // We retrieve the list of settings from the file
    this.list((configData) => {
      configData[configData.length] = connectionOptions

      // We overwrite the config file with the new setting
      let data = JSON.stringify(configData);
      fs.writeFile(this.configFileName, data, function (err) {
        if (err) {
          console.log('There has been an error saving your configuration data.');
          console.log(err.message);
          return;
        }
        console.log('Configuration saved successfully.')
      });
    })
  }
}


module.exports = new ConnectionSettingsController();
