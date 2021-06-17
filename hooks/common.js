const fs = require('fs');
const path = require('path');

/**
 * Possibly prints a message, possibly in a certain color, but definitely prints a new line.
 * @param {string} [message=] the message to print
 * @param {'white'|'red'|'yellow'|'green'|'cyan'} [color=] the color to print with
 */
function log(message, color) {
	if (message === undefined) {
		console.log(); 
		return;
	}
	if (color === undefined) {
		console.log(message);
		return;
	}
	let color_code = get_color_code(color);
	console.log('%s%s\x1b[0m', color_code, message);
}

/**
 * Gets a color code for a certain color
 * @param {'red'|'yellow'|'green'|'white'|'cyan'} [color='white'] the color
 */
function get_color_code(color) {
	if (color === 'red') return '\x1b[31m';
	if (color === 'yellow') return '\x1b[33m';
	if (color === 'green') return '\x1b[32m';
	if (color === 'cyan') return '\x1b[36m';
	return '\x1b[37m';
}
function isCordovaAbove (context, version) {
	var cordovaVersion = context.opts.cordova.version;
	log(cordovaVersion,"cyan");
	var sp = cordovaVersion.split('.');
	return parseInt(sp[0]) >= version;
}

function fromDir(startPath, filter, rec, multiple) {
	if (!fs.existsSync(startPath)) {
		log("no dir ", startPath,"red");
		return;
	}
	const files = fs.readdirSync(startPath);
	var resultFiles = [];
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		var stat = fs.lstatSync(filename);
		if (stat.isDirectory() && rec) {
		fromDir(filename, filter); //recurse
		}

		if (filename.indexOf(filter) >= 0) {
		if (multiple) {
			resultFiles.push(filename);
		} else {
			return filename;
		}
		}
	}
	if (multiple) {
		return resultFiles;
	}
}

function copyFolderSync(src, dest) {
	if (!fs.existsSync(dest)) fs.mkdirSync(dest)
  
	fs.readdirSync(src).forEach(dirent => {
	  const [srcPath, destPath] = [src, dest].map(dirPath => path.join(dirPath, dirent))
	  const stat = fs.lstatSync(srcPath)
  
	  switch (true) {
		case stat.isFile():
		  fs.copyFileSync(srcPath, destPath); break
		case stat.isDirectory():
		  copyFolderSync(srcPath, destPath); break
		case stat.isSymbolicLink():
		  fs.symlinkSync(fs.readlinkSync(srcPath), destPath); break
	  }
	})
  }

  function tree(src,depth){
	list = {};
	fs.readdirSync(src).forEach(dirent => {
		srcPath = path.join(src, dirent);
		const stat = fs.lstatSync(srcPath)
		if(stat.isFile()){
			list[srcPath] = "file";
		}else if(stat.isDirectory()){
			if(depth > 0){
				list[srcPath] = tree(srcPath,depth-1);
			}else{
				list[srcPath] = "directory";
			}
		}else{
			log(srcPath)
		}
	});
	return list;
  }

function getConfigParser(context, config){
	ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');      
	return new ConfigParser(config);
}
module.exports.pluginName = "cordova-outsystems-devicerisk";
module.exports.log = log;
module.exports.isCordovaAbove = isCordovaAbove;
module.exports.fromDir = fromDir;
module.exports.tree = tree;
module.exports.copyFolderSync = copyFolderSync;
module.exports.getConfigParser = getConfigParser;