const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder() 
        .setName("pause")
        .setDescription("Stopping current song"),

    async execute (client, interaction){
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply({ content: "There is no song in the queue." });
        }

        if (queue.paused) {
            return await interaction.reply({ content: "The song is already paused." });
        }

        const currentSong = queue.songs[0];
        queue.pause();
            await interaction.reply({ content: `${currentSong.name} has been paused.` });
    }
}