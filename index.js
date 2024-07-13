const { Client, GatewayIntentBits, Collection, VoiceState } = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const fs = require("fs")
const { DisTube } = require("distube")
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { VoiceConnectionStatus } = require("@discordjs/voice")
// const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.command = new Collection()

//SlashCommandHandling
const commands = [];
// Grab all the command folders from the commands directory you created earlier
const commandFiles = fs.readdirSync("./slash").filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./slash/${file}`);
    client.command.set(command.data.name, command);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
//SlashCommandHandling ends

client.distube = new DisTube(client, {
    plugins: [new YtDlpPlugin({ update: true })],
});

//client event
client.once("ready", (c) => {
    console.log(`✅ ${c.user.username} is online`)
})

client.on("interactionCreate", (interaction) => {
    if(!interaction.isCommand()) return;

    const command = client.command.get(interaction.commandName)
    try {
        command.execute(client, interaction)
    } catch (error) {
        interaction.reply({content: "There was an error executing this command.", ephemeral: true})
    }
})


// client.on("voiceStateUpdate", (interaction, oldState, newState) => {
//     // console.log(newState)
//     // console.log(oldState)
//     const botMember = oldState.guild.members.cache.get(client.user.id);
//     console.log(botMember)
//     // if (oldState.channelId !== null && newState.channelId == null){
//     //     const channel = oldState.channel;
//     //     if (channel && channel.members.size === 1) {
//     //         const botMember = channel.members.get(client.user.id);
//     //         if (botMember) {
//     //             botMember.voice.disconnect();
//     //             console.log("Im lonely 😔")
//     //             interaction.reply({content: "Im lonely in the voice channel 😔, Bye-Bye 🥲"})
//     //         }
//     //     }
//     // }   
// })

client.on("voiceStateUpdate", (interaction, oldState, newState) => {
    const botMember = oldState.guild.members.cache.get(client.user.id);

    // Check if the bot was in a channel and is now alone
    if (oldState.channelId && oldState.channel.members.size === 1 && oldState.channel.members.has(botMember.id)) {
        botMember.voice.disconnect();
        console.log("Im lonely 😔");
        interaction.reply({content: "Im lonely in the voice channel 😔, Bye-Bye 🥲"})
    }
});

client.login(TOKEN)