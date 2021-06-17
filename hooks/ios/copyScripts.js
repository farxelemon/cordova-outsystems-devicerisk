const fs = require('fs');
const {log,pluginName,copyFolderSync} = require("../common");

module.exports = function(context) {
    log("Start Coping scripts to Project!","green");

    if(!fs.existsSync("platforms/ios/scripts")){
        fs.mkdirSync("platforms/ios/scripts");
    }
    fs.copyFileSync("plugins/"+pluginName+"/libs/ios/slim-build-frameworks.sh","platforms/ios/scripts/slim-build-frameworks.sh");
    fs.copyFileSync("plugins/"+pluginName+"/libs/ios/add-framework-symbols-to-app-archive.sh","platforms/ios/scripts/add-framework-symbols-to-app-archive.sh");
    
    if(!fs.existsSync("platforms/ios/Frameworks-bcsymbolmap")){
        fs.mkdirSync("platforms/ios/Frameworks-bcsymbolmap");
        fs.copyFileSync("plugins/"+pluginName+"/libs/ios/9F57734E-35EC-3AAB-9924-0B96F11728BA.bcsymbolmap","platforms/ios/Frameworks-bcsymbolmap/9F57734E-35EC-3AAB-9924-0B96F11728BA.bcsymbolmap");
    }

    if(!fs.existsSync("platforms/ios/Frameworks-universal")){
        fs.mkdirSync("platforms/ios/Frameworks-universal");
        copyFolderSync("plugins/"+pluginName+"/libs/ios/FraudForce.framework","platforms/ios/Frameworks-universal/FraudForce.framework");

    }
    
    log("Finish Coping scripts to Project!","green");

}

