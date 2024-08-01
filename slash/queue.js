const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("See the running queue"),

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: "You need to be in a voice channel to play music." });
        }

        if (!queue || !queue.playing) {
            await interaction.reply({ content: "There is no song in queue" });
        } else {
            const currentSong = queue.songs[0];
            const queueString = queue.songs.slice(1).map((song, index) => `${index + 1}. [${song.name}](${song.url})`).join("\n");

            const queueEmbed = {
                color: 0x0099ff,
                title: 'Music Queue',
                description: `**Currently Playing:**\n[${currentSong.name}](${currentSong.url})\n\n**Up Next:**\n${queueString || "No more songs in queue."}`,
            };

            await interaction.reply({ embeds: [queueEmbed] });
        }

        
    }
}