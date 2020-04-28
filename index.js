const Discord = require("discord.js");
const { Utility } = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api")
const dotenv = require("dotenv").config();

const config = require("./config.json");
const color = require("./color.json");

const YOUTUBE_API = process.env.YT_API;
const BOT_PREFIX = process.env.PREFIX;

const youtube = new YouTube(YOUTUBE_API);
const queue = new Map();

const client = new Discord.Client();

client.on("ready", async () => {
    console.log(`${client.user.username} is online`);
    client.user.setActivity("24/7", {type: "STREAMING"});
});

// const fs = require("fs");
// client.commands = new Discord.Collection();
// client.aliases = new Discord.Collection();

// fs.readdir("./commands/", (err, files) => {
//     if(err) console.log(err)

//     let javas = files.filter(f => f.split(".").pop() === "js")
//     if(javas.length <= 0) {
//         return console.log("Can't find any command.");
//     } javas.forEach((f, i) => {
//         let pull = require(`./commands/${f}`);
//         client.commands.set(pull.config.name, pull);
//         pull.config.aliases.forEach(alias => {
//             client.aliases.set(alias, pull.config.name)
//         });
//     });
// });

client.on("message", async message => {
    if(message.author.bot) return undefined;
    if(!message.content.startsWith(BOT_PREFIX)) return undefined;

    const args = message.content.split(" ");
    const messageString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    const botQueue = queue.get(message.guild.id);

    let cmd = message.content.toLowerCase().split(" ")[0];
    cmd = cmd.slice(BOT_PREFIX.length);
    
    if(cmd === "help" || cmd === "h") {
        return message.channel.send("**Shaii Commands**\nPlay Song : `s.play <title/url>`\nSearch Song : `s.search <title>`\nSkip Song : `s.skip`\nResume Current Song : `s.resume`\nPause : `s.pause`\nStop : `s.stop`\nDisplay Current Song : `s.ds` / `s.np`\nDisplay Queue : `s.queue` \ `s.q`\nChanging Bot Volume : `s.volume` / `s.vol`\n\n**Developed by Ren#8847**");
    } if(cmd === "play") {
        const voice = message.member.voice;
        if(!voice) return message.channel.send("Sorry, an error occurred. (0x927208)");
        const permiss = voice.permissFor(message.client.user);
        if(!permiss.has("CONNECT")) {
            return message.channel.send("Sorry, an error occurred.(0x637260)");
        } if(!permiss.has("SPEAK")) {
            return message.channel.send("Sorry, an error occurred. (0x894486)");
        } if(url.match(/^https?:\/\/(www.youtube.com | youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const ytvideo = await playlist.getVideos();
            for(const video1 of Object.values(ytvideo)) {
                const video2 = await youtube.getVideoByID(video1.id);
                await handlingVideo(video2, message, voice, true);
            } return message.channel.send(`:ok_hand: **${playlist.title}** is sucessfully added to queue.`);
        } else {
            try {
                var video1 = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var ytvideo = await youtube.searchVideos(messageString, 5);
                    var video1 = await youtube.getVideoByID(ytvideo[0].id);
                    if(!video1) return message.channel.send("Sorry, an error occurred. (0x292816)");
                } catch (err) {
                    return message.channel.send("Sorry, an error occurred. (0x292816)");
                }
            } return handlingVideo(ytvideo, message, voice);
        }
    } if(cmd === "search") {
        const voice = message.member.voice;
        if(!voice) return message.channel.send("Sorry, an error occurred. (0x927208)");
        const permiss = voice.permissFor(message.client.user);
        if(!permiss.has("CONNECT")) {
            return message.channel.send("Sorry, an error occurred. (0x637260)");
        } if(!permiss.has("SPEAK")) {
            return message.channel.send("Sorry, an error occurred. (0x894486)");
        } if(url.match(/^https?:\/\/(www.youtube.com | youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const ytvideo = await playlist.getVideos();
            for(const video1 of Object.values(ytvideo)) {
                const video2 = await youtube.getVideoByID(video1.id);
                await handlingVideo(video2, message, voice, true);
            } return message.channel.send(`:ok_hand: **${playlist.title}** is sucessfully added to queue.`);
        } else {
        try {
            var video1 = await youtube.getVideo(url);
        } catch (error) {
            try {
                var ytvideo = await youtube.searchVideos(messageString, 10);
                let idx = 0;
             message.channel.send(`**Searched Song Results**
                    ${ytvideo.map(video2 => `${++idx} ${video2.title}`).join("\n")}

                    You have 10 seconds to choose one song by provide or type from 1 - 10. (Example: 1)`);
                try {
                    var respond = await message.channel.awaitMessages (message => message.content > 0 && message.content < 11, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ["time"]
                    });
                } catch (err) {
                    return message.channel.send(":alarm_clock: Time's up! No value entered.");
                } const vidIndex = parseInt(respond.first().content);
                var video1 = await youtube.getVideoByID(ytvideo[vidIndex - 1].id);
            } catch (err) {
                return message.channel.send("Sorry, an error occurred. (0x292816");
            }
        } return handlingVideo(video1, message, voice);
    }
} else if (cmd === "skip") {
    if(message.member.voice) return message.channel.send("Sorry, an error occurred. (0x927208)");
    if(!botQueue) return message.channel.send("Sorry, an error occurred. (0x161588)");
    botQueue.connection.dispatcher.end("Song skipped.");
 message.channel.send(":ok_hand: Song skipped.");
    return undefined;
} else if (cmd === "stop") {
    if(message.member.voice) return message.channel.send("Sorry, an error occurred. (0x927208)");
    if(!botQueue) return message.channel.send("Sorry, an error occurred. (0x631740)");
    botQueue.songs = [];
    botQueue.connection.dispatcher.end("Stopped.");
    message.channel.send("Stopped.");
} else if (cmd === "volume" || cmd === "vol") {
    return message.channel.send("Changing the bot volume is only available with Shaii Pro. For now, you can change volume of the bot manually.");
} else if (cmd === "queue" || cmd === "q") {
    if(!botQueue) return message.channel.send("Sorry, an error occurred. (0x783650)");
    return message.channel.send(`**Current Queue** ${botQueue.songs.map(song => `- ${song.title}`).join("\n")}`);
} else if (cmd === "pause") {
    if(botQueue && botQueue.playing) {
        botQueue.playing = false;
        botQueue.connection.dispatcher.pause();
        return message.channel.send(":pause_button: Paused.");
    } return message.channel.send("Sorry, an error occurred. (0x661021)");
} else if (cmd === "resume") {
    if(botQueue && botQueue.playing) {
        botQueue.playing = false;
        botQueue.connection.dispatcher.pause();
        return message.channel.send(":arrow_forward: Song resumed.");
    } return message.channel.send("Sorry, an error occurred. (0x934336)");
} return undefined;
});

async function handlingVideo(video1, message, voice, playlist = false) {
    const botQueue = queue.get(message.guild.id);
    const song = {
        id: video1.id,
        title: Utility.escapeMarkdown(video1.title),
        url: `https://www.youtube.com/watch?v=${video1.id}`
    };

    if(!botQueue) {
        const queueConst = {
            textChannel: message.channel,
            voiceChannel: voice,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        }; queue.set(message.guild.id, queueConst);

        queueConst.songs.push(song);

        try {
            var connection = await voice.join();
            queueConst.connection = connection;
            playlist(message.guild, queueConst.songs[0]);
        } catch (error) {
            queue.delete(message.guild.id);
            return message.channel.send("Sorry, an error occurred. (0x305624)");
        }
    } else {
        botQueue.songs.push(song);
        if(playlist) return undefined;
        else return message.channel.send(`:ok_hand **${song.title}** is successfully added to queue.`);
    } return undefined;
}

function play(guild, song) {
    const botQueue = queue.get(guild.id);

    if(!song) {
        botQueue.voice.leave();
        queue.delete(guild.id); return;
    } const dispatcher = botQueue.connection.playStream(ytdl(song.url)).on("end", reason => {
        if(reason === "Sorry, an error occurred. (0x579609)");
        botQueue.songs.shift();
        play(guild, botQueue.songs[0]);
    }).on("error", error => console.error(error));
    botQueue.textChannel.send(`:musical_note: Streaming: **${song.title}**`);
}
client.login(config.token);
