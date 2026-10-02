require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const musique = require('./musique.js');

client.on('clientReady', () => {
	console.log(`Logged in as ${client.user.tag}!`);
  //console.log(typeof ytdl === 'function');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  //* 1er test ping
  if (commandName === 'ping') {
    await interaction.reply('Pong!');
    await interaction.followUp({ content: '23 à 0!', ephemeral: true });
  }

  //* 1er test bouton
  if (commandName === 'button') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Click me!')            // * texte du button
            .setStyle(ButtonStyle.Primary)
          .setEmoji("🥅")                   // * mettre un emoji
          //.setDisabled(true)              // * empecher l'utilisation sans le faire disparaitre
      );
    await interaction.reply({ content: 'I think you should,', components: [row] });
  }

  //* 1er test roll
  if (commandName === 'roll'){

    // TODO: On ne peut sélectionner que 1 seul type de dé à changer 
    const options = await interaction.options.data;
    const nbDice = options[0].value;
    const nbMax = options[1].value;

    let sentence = "";

    for (let i = 0; i < nbDice; i++) {
      const rdmNum = Math.floor(Math.random() * (nbMax - 1 + 1)) + 1;
      sentence = sentence + rdmNum + " ";
    }
    // Créer un embed
    const embed = {
      title: 'Résultat du lancer de dés',
      description: `Voici les résultats : ${sentence}`,
      color: 0xff0000,
    };
    
    // * Envoyer l'embed dans le channel
    await interaction.reply({ embeds: [embed] });
  }

  //* fourre-tout d'essai
  if (commandName === 'test') {
  }


  //* Liste des commandes musique.js
  if (commandName === 'play') {
    await musique.play(interaction);
  }

  if (commandName === 'list') {
    await musique.list(interaction);
  }

  if (commandName === 'pause') {
    await musique.pause(interaction);
  }

  if (commandName === 'resume') {
    await musique.resume(interaction);
  }

  if (commandName === 'skip') {
    await musique.skip(interaction);
  }

  if (commandName === 'disconnect') {
    await musique.disconnect(interaction);
  }
});

client.login(process.env.TOKEN);