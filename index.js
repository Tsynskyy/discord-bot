const Discord = require('discord.js'); //подключаем дискород

const bot = new Discord.Client({ 
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
}) //прописываем дискорд интенты (без этого никак), могут понадобиться новые, надо чекать ошибки

const { joinVoiceChannel } = require("@discordjs/voice");

const connection = joinVoiceChannel(
{
	channelId: channel.id,
	guildId: channel.guild.id,
	adapterCreator: channel.guild.voiceAdapterCreator,
});

const ytdl = require("ytdl-core"); //подключаем подкачку видосов с ютуба

const token = 'MTA0MDgyNTcyMDg5NDY1MjQ3OA.G8Hdp5.jeqlAWTk3cyyUdnACVPOI-1ZQOUEpnvGpSHinM'; //токен бота

const prefix = '-'; //префикс бота

bot.login(token); //подключаем бота

let servers = {};

bot.on('ready', () => {
    console.log('This bot is online!');
});

bot.on("messageCreate", message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping') {
        message.channel.send({content: "pong"});
    }
    console.log(args);

    switch (command) {
        case 'play':

            function play(connection, message) {
                let server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function() {
                    if(server.queue[0]) {
                        play(connection, message);
                    }
                    else {
                        connection.disconnect();
                    }
                });
            }

            if(!args[0]) {
                message.channel.send({content: "где ссылка бля"});
                return;
            }

            if(!message.member?.voice.channel) {
                message.channel.send({content: "в войс чат зайди еблан, куда мне заходить???"});
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }
            
            let server = servers[message.guild.id];

            server.queue.push(args[0]);

            if(!message.guild.voiceConnection) message.member?.voice.channel.join().then(function(connection) {
                play(connection, message);
            })



        break;
    }
});


