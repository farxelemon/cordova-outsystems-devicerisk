const fs = require('fs');
const {log,pluginName,copyFolderSync} = require("../common");

module.exports = function(context) {
    log("Start Coping scripts to Project!","green");

    if(!fs.existsSync("platforms/ios/scripts")){
        fs.mkdirSync("platforms/ios/scripts");
    }
    fs.copyFileSync("plugins/"+pluginName+"/libs/ios/add-framework-symbols-to-app-archive.sh","platforms/ios/scripts/add-framework-symbols-to-app-archive.sh");
    
    if(!fs.existsSync("platforms/ios/Frameworks-bcsymbolmap")){
        fs.mkdirSync("platforms/ios/Frameworks-bcsymbolmap");
        fs.copyFileSync("plugins/"+pluginName+"/libs/ios/9D3BBDBA-726D-3C4A-A0A1-2DD6B6E27123.bcsymbolmap","platforms/ios/Frameworks-bcsymbolmap/9D3BBDBA-726D-3C4A-A0A1-2DD6B6E27123.bcsymbolmap");
    }

    if(!fs.existsSync("platforms/ios/Frameworks-universal")){
        fs.mkdirSync("platforms/ios/Frameworks-universal");
        copyFolderSync("plugins/"+pluginName+"/libs/ios/FraudForce.xcframework","platforms/ios/Frameworks-universal/FraudForce.xcframework");

    }
    
    log("Finish Coping scripts to Project!","green");

}

