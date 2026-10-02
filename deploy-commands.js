require('dotenv').config();
const { SlashCommandBuilder, Routes, PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Il va te répondre avec pong'),
  new SlashCommandBuilder().setName('button').setDescription('Faire apparaitre un bouton'),
  new SlashCommandBuilder().setName('join').setDescription('Rejoindre le vocal'),
  new SlashCommandBuilder().setName('disconnect').setDescription('Tuer le bot'),
  new SlashCommandBuilder().setName('pause').setDescription('Mettre en pause la playlist'),
  new SlashCommandBuilder().setName('resume').setDescription('Reprendre la playlist'),
  new SlashCommandBuilder().setName('list').setDescription('Afficher la playlist'),
  new SlashCommandBuilder().setName('skip').setDescription('NEXT'),

  new SlashCommandBuilder().setName('test').setDescription('mes essaie commande divers et variés')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
      .setName('test')
      .setDescription('variable en fonction de mes besoins')
      .setRequired(true)
    ),

  new SlashCommandBuilder().setName('play').setDescription('Jouer une musique')
    .addStringOption(option => option
      .setName('url')
      .setDescription('URL youtube')
      .setRequired(true)
    ),

  new SlashCommandBuilder().setName('roll').setDescription('ROLL MY DICE')
  .addIntegerOption(option => option
    .setName('nbdé')
    .setDescription('Nombre de dé')
    .setRequired(true)
  )
  .addIntegerOption(option => option
    .setName('nbmax')
    .setDescription('chiffre maximum du dé')
    .setRequired(true)
  ),

  /** ! Obsolète car fonctionnalité rajouté de base sur ds
  /new SlashCommandBuilder().setName('strawpoll').setDescription('créer un strawpoll')
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
  ),*/

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);