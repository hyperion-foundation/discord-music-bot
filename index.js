/*
  Shaii / Shaii Pro / Shaii Tester is developed by Hyperion Dev Team.
  All these codes are also written by Hyperion Dev Team.
  These codes are copyrighted to Hyperion and all rights reserved.
*/

// Required Packages & Files
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const config = require("./config.json");
const color = require("./color.json");

// Bot Client
const client = new Discord.Client();

// Console Message
client.on("ready", async () => {
    console.log(`${client.user.username} is online.`);
});

// Bot Token
client.login(config.token);
