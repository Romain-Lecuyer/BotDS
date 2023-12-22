require('dotenv').config();
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('button').setDescription('lacher un AAAAAAA'),
  new SlashCommandBuilder().setName('strawpoll').setDescription('créer un strawpoll')
  .addStringOption(option => option
    .setName('title')
    .setDescription('Titre du poll')
    .setMaxLength(50)
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('option1')
    .setDescription('Option 1')
    .setMaxLength(10)
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('option2')
    .setDescription('Option 2')
    .setMaxLength(10)
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('option3')
    .setDescription('Option 3')
    .setMaxLength(10)
  )
  .addStringOption(option => option
    .setName('option4')
    .setDescription('Option 4')
    .setMaxLength(10)
  )
  .addStringOption(option => option
    .setName('option5')
    .setDescription('Option 5')
    .setMaxLength(10)
  ),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);