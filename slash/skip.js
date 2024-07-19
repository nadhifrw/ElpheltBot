const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song'),
        
    
    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guild.id);
        
        if (!queue) {
            return await interaction.reply({ content: "There is no song in the queue." });
        }

        const currentSong = queue.songs[0];

        try {
            if (queue.songs.length > 1) {
                await queue.skip();
                await interaction.reply({ content: `${currentSong.name} has been skipped!` });
            } else {
                queue.stop();
                await interaction.reply({ content: `${currentSong.name} has been skipped! No more songs in the queue. Stopping the music.` });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error trying to skip the song."});
        }
    }
};
