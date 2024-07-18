const { SlashCommandBuilder, VoiceChannel, TextChannel } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Playing Songs!")
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription("Song Url")
                .setRequired(false)
            )
        .addStringOption(option =>
            option
                .setName("keyword")
                .setDescription("Song Keyword")
                .setRequired(false)
        ),
        
    async execute(client, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: "You need to be in a voice channel to play music." });
        }

        const keyword = interaction.options.getString("keyword");
        const url = interaction.options.getString("url");
        if (!url && !keyword) {
            return await interaction.reply({ content: "You need to provide either an URL or a keyword for the song.", ephemeral: true });
        }

        // Ensure the bot has permission to join and speak in the voice channel
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return await interaction.reply({ content: "I need permissions to join and speak in your voice channel!", ephemeral: true });
        }

        try {
            await interaction.deferReply();
            const searchQuery = url || keyword;
            const queue = client.distube.getQueue(interaction.guild.id);
            if (queue) {
                client.distube.play(voiceChannel, searchQuery, {
                    textChannel: interaction.channel,
                    member: interaction.member,
                });
            } else {
                client.distube.play(voiceChannel, searchQuery, {
                    textChannel: interaction.channel,
                    member: interaction.member,
                });
            }

            await interaction.followUp({ content: `🎶 Playing music: ${searchQuery}` });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "There was an error playing the song.", ephemeral: true });
        }
    }
};