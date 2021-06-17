var xcode;
const fs = require('fs');
const path = require('path');
const {isCordovaAbove,log,pluginName,fromDir,tree} = require("../common");
var xmlParser;

const xcodeProjPath = fromDir('platforms/ios', '.xcodeproj', false);
const appName = xcodeProjPath.split(".")[0].split("/")[2];
const xcschemePathProj = path.join(xcodeProjPath,"xcshareddata/xcschemes",appName+".xcscheme");
const xcschemePathWorkspace = path.join("platforms/ios",appName+".xcworkspace","xcshareddata/xcschemes",appName+".xcscheme");
var myProj;

module.exports = function(context) {
  log("====Started Adding Scripts to Project!====","green")
  if(isCordovaAbove(context,8)){
    xcode = require('xcode');
    xmlParser = require('xml-js');
  }else{
    xcode = context.requireCordovaModule('xcode');
    xmlParser = context.requireCordovaModule('xml-js');
  }

  const archiveScript = "${PROJECT_DIR}/scripts/add-framework-symbols-to-app-archive.sh";

  //add to archivescripts
  if(fs.existsSync(xcschemePathProj)){
    addArchiveToScheme(xcschemePathProj)
  }
  if(fs.existsSync(xcschemePathWorkspace)){
    addArchiveToScheme(xcschemePathWorkspace)
  }

  function addArchiveToScheme(schemePath){
    log("Started Adding Archive script!","green")
    schemeFile = fs.readFileSync(schemePath,"utf8");
    schemeObj = xmlParser.xml2js(schemeFile, {compact: true, spaces: 4});

    newBuildableReference = schemeObj.Scheme.BuildAction.BuildActionEntries.BuildActionEntry.BuildableReference

    newActionContent = {"_attributes":{"title":"deviceRisk","scriptText":archiveScript},"EnvironmentBuildable":{"#text":[],"_attributes":{},"BuildableReference":newBuildableReference}}
    newExecuteAction = {"_attributes":{"ActionType":"Xcode.IDEStandardExecutionActionsCore.ExecutionActionType.ShellScriptAction"},"ActionContent":newActionContent};


    schemeObj.Scheme.ArchiveAction.PostActions = {"_attributes":[],"ExecutionAction":newExecuteAction};

    log(schemeObj,"green")
    schemeFile = xmlParser.js2xml(schemeObj, {compact: true, spaces: 4})
    fs.writeFileSync(schemePath,schemeFile);

    log("====Added Archive script!====","green")
  }
  

  function replacerCallback(match, p1,p2, p3, p4,p5, offset, string){
    return [p1,p4,p2,p3,p5].join("");
  }
}