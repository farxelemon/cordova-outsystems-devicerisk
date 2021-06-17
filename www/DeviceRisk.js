var exec = require('cordova/exec');

exports.setup = function (arg0, success, error) {
    exec(success, error, 'DeviceRisk', 'setup', [arg0]);
};
exports.getBlackBox = function (success, error) {
    exec(success, error, 'DeviceRisk', 'getBlackBox', []);
};
