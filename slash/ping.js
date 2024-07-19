const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Testing out the bot!"),
        

    async execute(client, interaction) {
        // interaction.reply(`Ping: ${client.ws.ping}`); ${sent.createdTimestamp - interaction.createdTimestamp}
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Ping: ${client.ws.ping} ms`);
    }
};

