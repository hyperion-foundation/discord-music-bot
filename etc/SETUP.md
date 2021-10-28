***This README is not final. Please don't follow these steps yet. Some of these steps may change anytime without prior notification.***

# How to setup & run Shaii
We give you an easy step-by-step how to setup and run Shaii properly.
> Important: Please keep in mind, all these steps are done manually and some steps require some developer skills, but you don't need to worry, we will help you if you have a problem while you set up your development environment. 
We appreciate your efforts and your given time to use our apps/services. If you feeling you have advance skill in coding, then we don't need to make more explanation.

## Development Environment
> Before getting started, you need to install 1 text editor and Node.js to your computer.

[Visual Studio Code](https://code.visualstudio.com/) - Recommended 👍
[Sublime Text](https://www.sublimetext.com/) - Optional 🤷‍♂️
Notepad / Notepad++ - Not recommended 🙅‍♂️
[Node.js](https://nodejs.org/en/) LTS 12 or latest version
[

## Shaii Requirements

<!-- 1. Terminals
  - Command Prompt (**Windows**)
  - Terminal (**Linux**)
> Note: If you choose VSC or Visual Studio Code, you don't need to use or open more terminal, because VSC already has configured built-in terminal. You can open and use it by pressing **Ctrl** + **J**. -->
1. **Required npm Packages**
  - [discord.js v12.5.3](https://www.npmjs.com/package/discord.js/v/12.5.3) - Node.js module to interact with Discord API
    - [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus) - To interact Discord Voice API
  - [FFmpeg](https://ffmpeg.org) & [FFmpeg via npm](https://www.npmjs.com/package/ffmpeg-static) - To allow you to play media format (eg. .mp3)
  - Encryption Packages - Voice packet encryption and decryption (**Choose one**)
    - [sodium](https://www.npmjs.com/package/sodium) - **Recommended**
    - [libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers) - **Optional**
  - Process Manager - Allows you to start, stop, restart or delete your bot process with ease (**Choose one**)
    - [PM2](https://www.npmjs.com/package/pm2) - **Recommended**
    - [forever](https://www.npmjs.com/package/forever) - **Optional**
  - [dotenv](https://www.npmjs.com/package/dotenv) - To store your bot configuration
 
 2. **Optional npm Packages**
  - [ytdl-core](https://www.npmjs.com/package/ytdl-core) - It allows you to play music from YouTube
  
