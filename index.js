require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const audioPlayer = createAudioPlayer();
const list = [];
async function getAudioStreamUrl(youtubeUrl) {
  const { stdout } = await execFileAsync('yt-dlp', ['-f', 'bestaudio', '-g', youtubeUrl]);
  return stdout.trim();
}


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

  if (commandName === 'join'){
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.member.voice.channel.guildId,
      adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
    });
    await interaction.reply('c good');
  }
  if (commandName === 'checkco'){
    console.log(getVoiceConnection(interaction.guildId)?.state.status);
    console.log(interaction.member.voice.channel.members.map(m => m.user.username));
    await interaction.reply('c good');
  }
  //* lancer une musique
  if (commandName === 'play'){
    let connection = getVoiceConnection(interaction.guildId);

    if (interaction.member.voice.channel == null) {
      await interaction.reply('Aucun channel vocal trouvé');
      return;
    }
    else if (!connection) {
      //* Connection au vocal où la personne est présente
      connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.member.voice.channel.guildId,
        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
      });
    }

    const options = await interaction.options.data;
    const lien = options[0].value;
    const nbMusiques = list.length;

    list.push(lien);
    //* Verif si une musique est déjà lancée
    if(nbMusiques > 0){
      await interaction.reply('Musique ajoutée à la playlist');
      return; //* on arrete le programme
    } 
    else{
      await interaction.reply('OKAAAAY LETZ GO');
    }

    //! Ne transitionne pas sur la 2e musique, à corriger
    connection.subscribe(audioPlayer);
    try {
      const [, url] = await Promise.all([
        entersState(connection, VoiceConnectionStatus.Ready, 5_000),
        getAudioStreamUrl(list[0]),
      ]);
      const musique = createAudioResource(url);
      audioPlayer.on('stateChange', (oldState, newState) => {
        console.log(`Player: ${oldState.status} -> ${newState.status}`); //* Etat du bot (idle, buffering, playing, paused)
      });
      audioPlayer.play(musique);
    } catch (err){
      console.error('Erreur yt-dlp:', err);
    }
  } 

  //* afficher la playlist
  if (commandName === 'list'){
    await interaction.reply('Liste des musiques :\n' + list.join('\n'));
  }

  //* mettre en pause la playlist
  if (commandName === 'pause'){
    audioPlayer.pause();
    await interaction.reply('c good');
  }
  //* remettre la playlist
  if (commandName === 'resume'){
    audioPlayer.unpause();
    await interaction.reply('c good');
  }

  //* déconnection du bot
  if (commandName === 'disconnect'){
    const connection = getVoiceConnection(interaction.guildId,);
    connection.destroy();
    await interaction.reply('So long gay ' + interaction.member.user.username + '!');
  }
});

client.login(process.env.TOKEN);