const { SlashCommandBuilder } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get that lyrics"),

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply({ content: "There is no song in the queue." });
        }
        const currentSong = queue.songs[0];
        const inputTitle = currentSong.name;
        const inputArtist = currentSong.uploader.name;
        // console.log(inputTitle);
        // console.log(songArtist);
        
        // Renaming for the title to fit for the API
        let songTitle;
        if (inputTitle.includes("-") && inputTitle.includes("(")) {
            songTitle = inputTitle.split('-')[1].split('(')[0].trim();
        
        } else if (inputTitle.includes("-")){
            songTitle = inputTitle.split('-')[1].trim();
        } else {
            songTitle = inputTitle;
        }
        // console.log(songTitle);

        //renaming the artist name so it fit for the API
        let songArtist;
        if (inputArtist.includes('-')) {
            songArtist = inputArtist.split('-')[0].trim()
        } else {
            songArtist = inputArtist
        }
        // console.log(songArtist)

        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(songArtist)}/${encodeURIComponent(songTitle)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const lyrics = data.lyrics;
            const queueEmbed = {
                color: 0x0099ff,
                title: `${songTitle}`,
                description: `${lyrics}`,
            };
            await interaction.reply({ embeds: [queueEmbed], });
            return lyrics ? lyrics : 'No lyrics found for this song.';
        } catch (error) {
            await interaction.reply({content: "Could find the lyrics"}) 
            // console.error('Error fetching lyrics:', error);
            // return 'There was an error fetching the lyrics.';
        }
    }

}