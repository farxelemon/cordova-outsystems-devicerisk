const child_process = require('child_process');
const {isCordovaAbove,log} = require("../common");

module.exports = function (context) {
    var cordovaAbove8 = isCordovaAbove(context, 8);
    if (!cordovaAbove8) {
      log("====NPM Install!====","green")
      var deferral = context.requireCordovaModule("q").defer();
      child_process.exec('npm install', {cwd:__dirname},
        function (error) {
          if (error !== null) {
            log('exec error: ' + error,"red");
            deferral.reject('npm installation failed');
          }
          deferral.resolve();
      });

      return deferral.promise;
    }
    return;
};
