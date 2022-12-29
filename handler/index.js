const { glob } = require("glob");
const { promisify } = require("util");
const { Client, Guild } = require("discord.js");
const mongooseConnectionString  = process.env.mongoURL
const mongoose = require("mongoose");
const { guilds } = require("..");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER","STRING","User"].includes(file.type)) delete file.description;
        if (file.userPermissions) file.defaultPermissions = false;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild

        // Register for all the guilds the bot is in
        // const guild = client.guilds.cache.get("")
        //  await guild.commands.set(arrayOfSlashCommands)
    });

    // mongoose
        if (!mongooseConnectionString) return;

     mongoose.connect("mongodb+srv://Ahmed2588:ahmed2588@cluster0.jflvv.mongodb.net/test", {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(console.log("Connected"))

    

    
    


    
};
