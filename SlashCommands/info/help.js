const { Message, Client,MessageEmbed,MessageActionRow,MessageSelectMenu,CommandInteraction } = require("discord.js");

module.exports = {
    name: "help",
    description: "To know all of bot commands",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction, args) => {
        const directories = [...new Set(client.commands.map(cmd => cmd.directory))]

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

        const categories = directories.map((dir) => {
            const getcommands = client.commands.filter(
                (cmd) => cmd.directory === dir
            ).map(cmd => {
                return {
                    name: cmd.name || "no name to this command!",
                    description: cmd.description || "No description for this commands",
                };
            });

            return {
                directory: formatString(dir),
                commands: getcommands,
            };
        });

        const embed = new MessageEmbed().setDescription(
            "Please chose category in the dropdwon menu"
        );

        const componerts = (status) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu().setCustomId("help-menu").setPlaceholder("Please select a category")
                .setDisabled(status)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label : cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `Commands from ${cmd.directory} category`
                        }
                    })
                )
            )
        ];
        const initiaMessage = await interaction.followUp({
            embeds: [embed],
            components: componerts(false),
        }).catch((e) => {
            console.log(e)
        })

        const filter = (user) => user.user.id === interaction.member.id; 

        const collector = interaction.channel.createMessageComponentCollector({filter, componentType: 'SELECT_MENU'})

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;

            const category = categories.find(x => x.directory.toLowerCase() === directory);
            
            const categoryembed = new MessageEmbed().setTitle(`${directory} commands`).setDescription("Here is the list of commands").addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    }
                })
            );

            interaction.update({embeds: [
                categoryembed
            ]})
        });

        collector.on('end', () => {
            initiaMessage.edit({ components: componerts(true) })
        })
    },
};
