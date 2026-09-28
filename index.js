require('dotenv').config();
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

client.on('clientReady', () => {
	console.log(`Logged in as ${client.user.tag}!`);
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

    //! On ne peut sélectionner que 1 seul type de dé à changer 
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

  //* faire rejoindre le bot dans un channel
  if (commandName === 'join'){

    //! LE BOT CRASH SI LA COMMANDE EST EFFECTUE SANS LA PERSONNE DANS LE CHANNEL
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.member.voice.channel.guildId,
      adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
    });
    await interaction.reply('et bijour!');
  } 

  //* déconnection du bot
  if (commandName === 'disconnect'){

    //! LE BOT CRASH SI LA COMMANDE EST EFFECTUE SANS LA PERSONNE DANS LE CHANNEL
    const connection = getVoiceConnection(interaction.guildId,);
    connection.destroy();
    await interaction.reply('So long gay ' + interaction.member.user.username + '!');
  }
});

client.login(process.env.TOKEN);