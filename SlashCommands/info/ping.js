const { Client, CommandInteraction,MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const embed = new MessageEmbed().setTitle("Ping 🏓").setDescription(`${client.ws.ping}ms!`).setColor("GREEN").setTimestamp()
        interaction.followUp({ embeds: [embed] });
    },
};
