const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const audioPlayer = createAudioPlayer();
const list = [];
let salon = null;
let idleTimer = null;
let currentGuildId = null;

async function getAudioStreamUrl(youtubeUrl) {
  const { stdout } = await execFileAsync('yt-dlp', ['-f', 'bestaudio', '-g', youtubeUrl]);
  return stdout.trim();
}

//* rajouter une musique à la playlist
async function play(interaction) {
  let connection = getVoiceConnection(interaction.guildId);
  salon = interaction.channel;
  currentGuildId = interaction.guildId;

  if (interaction.member.voice.channel == null) {
    await interaction.reply("Aucun channel vocal trouvé");
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
  if (nbMusiques > 0) {
    await interaction.reply("Va falloir attendre un peu mon brave, il y a déjà " + nbMusiques + " vidéo avant");
    return; //* on arrete le programme
  }
  else {
    await interaction.reply("OKAAAAY LETZ GO");
  }
  connection.subscribe(audioPlayer);
  await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
  await lancerMusique();
}

//* afficher la playlist
async function list_(interaction) {
  await interaction.reply("Liste des musiques :\n" + list.join('\n'));
}

//* mettre en pause la playlist
async function pause(interaction) {
  audioPlayer.pause();
  await interaction.reply("c good");
}

//* remettre la playlist
async function resume(interaction) {
  audioPlayer.unpause();
  await interaction.reply("c good");
}

//* prochaine musique
async function skip(interaction) {
  list.shift();
  console.log("list après shift : " + list);
  if(list.length === 0) {
    audioPlayer.stop();
    await interaction.reply("et voila c'est fini");
    return
  }
  await interaction.reply("nul ! NEXT");
  await lancerMusique();
}

//* déconnection du bot
async function disconnect(interaction = null) {
    const connection = getVoiceConnection(currentGuildId);
    if(connection) {
        connection.destroy();
    }
    if(interaction) {
        await interaction.reply("So long gay " + interaction.member.user.username + "!");
    }
    else {
      await envoyerMessage("On veut plus de moi ? Bon...");
    }
}

//* lancer une musique
async function lancerMusique() {
  if (list.length === 0) {
    console.log('ya plus rien la');
    return;
  }
  try {
    const url = await getAudioStreamUrl(list[0]);
    const musique = createAudioResource(url);
    audioPlayer.play(musique);
    await envoyerMessage("eeeeeet on est parti pour : " + list[0]);
  } catch (err) {
    console.error('Erreur yt-dlp:', err);
  }
}

//* Envoyer un message dans le channel ou le bot a été appelé
async function envoyerMessage(texte) {
  if (salon) {
    await salon.send(texte);
  }
}

//* gestion du changement d'état du bot
audioPlayer.on('stateChange', (oldState, newState) => {
  console.log(`Player: ${oldState.status} -> ${newState.status}`); //* affiche l'ancien et le nouvel état du bot (idle, buffering, playing, paused)
  
  //* une musique est terminée
  if (oldState.status === 'playing' && newState.status === 'idle' ) {
    list.shift();
    lancerMusique();
  }

  if (newState.status === 'idle' && list.length === 0) {  // ajout de cette condition
    idleTimer = setTimeout(() => { disconnect(); }, 60000);
  }
  else {
    //* annule le minuteur
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
      console.log("minuteur arreté");
    }
  }
});



module.exports = { play, list: list_, pause, resume, skip, disconnect, audioPlayer };