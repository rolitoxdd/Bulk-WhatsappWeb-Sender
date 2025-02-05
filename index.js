//TODO use baileys?
import askInput from "./questions.js";
import sendMessages from "./WASend.js";

import os from 'os';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import packageJSON from './package.json' assert  { type: 'json' };
import {getGoogleChromePath} from "get-google-chrome-path";
import pressAnyKey from 'press-any-key';

//process.env.CAXA is true if compiled, undefined if no NO
global.pupPath = '';
global.delayms = [30000, 50000];

global.compiled = false;
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
__dirname.startsWith(path.join(os.tmpdir(), "caxa")) ? global.compiled=true : global.compiled=false;


program
	.name('Bulk-WhatsappWeb-Sender')
	.description('Send bulk messages to a telephone number list')
	.version(packageJSON.version);

program
	.option('-n, --numbers <numbersFile>', 'pass numbers file as a parameter')
	.option('-m, --message [msg]', 'write message directly as a parameter, overwrites \'--text-file\'')
	.option('-M, --no-message', 'do not send text, overwrites \'--message\' and \'--text-file\'')
	.option('-t, --text-file [textFile]', 'pass message to send as a file')
	.option('-f, --files [mediaFiles...]', 'pass media to send with their path')
	.option('-F, --no-files', 'do not send files, overwrites \'--files\'')
	.option('-d, --low-delay', 'send messages with a low delay, use this if you are confident that you won\'t be banned')
	.option('-D, --high-delay', 'send messages with a high delay, use this if you are sending to new numbers (high probability of being banned)')
	.option('-la, --local-auth', 'use LocalAuth authentication mode instead of NoAuth (keep your account logged in)', false)
	.option('-lc, --local-chromium', 'use local Chromium executable instead of installed Chrome', false);

program.parse();
global.options= program.opts();

if(options.lowDelay){
	global.delayms = [500, 9000];
}
else if(options.highDelay){
	global.delayms = [60000, 600000];
}

// TODO download chromium only if needed https://github.com/vercel/pkg/issues/204#issuecomment-333288567
/*if(compiled){
	pupPath=getInternalChromiumPath();
}*/

if(!options.localChromium){
	//Check if Chrome is installed		//TODO also check Chromium (and Edge?)
	/*if(fs.existsSync(require('get-google-chrome-path').getGoogleChromePath()))
		pupPath=require('get-google-chrome-path').getGoogleChromePath();*/
	if(fs.existsSync(getGoogleChromePath()))
		pupPath=getGoogleChromePath();
}

/* var numbersFile;
var messageToSend;
var filesToSend; */

askInput(sendMessages);		//Bootstrap

/* await questions.ask();
WASend.send(numbersFile, messageToSend, mediaToSend); */

if(compiled)
	pressAnyKey("Press any key to exit...");	//TODO DOES NOT WAIT!

function getInternalChromiumPath(){
	// return 'C:\Users\alber\Desktop\Bulk-WhatsappWeb-Sender\build\.local-chromium\win64-982053\chrome-win\chrome.exe';
	let execDir=path.join(process.execPath, '..');
	let dirPlatVer=fs.readdirSync(path.join(execDir,'.local-chromium'))[0];		//e.g.: ./.local-chromium
	let dirPlat=fs.readdirSync(path.join(execDir,'.local-chromium',dirPlatVer))[0];	//e.g.: ./.local-chromium/linux-*
	if(process.platform === 'win32')
		return path.join(execDir,'.local-chromium',dirPlatVer,dirPlat,'chrome.exe');	//e.g.: ./.local-chromium/linux-*/chrome-win/chrome.exe
	else if(process.platform === 'linux')
		return path.join(execDir,'.local-chromium',dirPlatVer,dirPlat,'chrome');	//e.g.: ./.local-chromium/linux-*/chrome-linux/chrome
}