const { SlashCommandBuilder, VoiceChannel, TextChannel } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Playing Songs!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search") // Changed to lowercase
                .setDescription("Search for the song")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("Song Url")
                        .setRequired(true)
                )
        ),



    async execute(client, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: "You need to be in a voice channel to play music." });
        }

        const url = interaction.options.getString("url");
        if (!url) {
            return await interaction.reply({ content: "You need to provide a URL for the song.", ephemeral: true });
        }

        // Ensure the bot has permission to join and speak in the voice channel
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return await interaction.reply({ content: "I need permissions to join and speak in your voice channel!", ephemeral: true });
        }

        try {
            await interaction.deferReply();
            const queue = client.distube.getQueue(interaction.guild.id);
            if (queue) {
                client.distube.play(voiceChannel, url, {
                    textChannel: interaction.channel,
                    member: interaction.member,
                });
            } else {
                client.distube.play(voiceChannel, url, {
                    textChannel: interaction.channel,
                    member: interaction.member,
                });
            }

            await interaction.followUp({ content: `🎶 Playing music: ${url}` });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "There was an error playing the song.", ephemeral: true });
        }
    }
};