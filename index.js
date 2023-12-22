require('dotenv').config();
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits,  } = require('discord.js');
const client = new Client({ intents: GatewayIntentBits.Guilds });

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
    await interaction.followUp({ content: '23 à 0!', ephemeral: true });
  }

  if (commandName === 'button') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Click me!')            //texte du button
            .setStyle(ButtonStyle.Primary)
          .setEmoji("🥅")                   //mettre un emoji
          //.setDisabled(true)              //empecher l'utilisation sans le faire disparaitre
      );
    await interaction.reply({ content: 'I think you should,', components: [row] });
  }

  if (commandName === 'strawpoll'){
    await interaction.deferReply({ ephemeral: true });
    const { channel } = await interaction;
    const options = await interaction.options.data;
    console.log(options);
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

    let embed = new EmbedBuilder()
      .setTitle(`${options[0].value}`)
      .setColor('Green')

      for(let i = 1; i < options.length; i++){
        let emoji = emojis[i-1];
        let option = options[i];
        embed.addFields(
          {
            name: `${emoji} ${option.value}`,
            value: ' '
          }
        )
      }

      const message = await channel.send({embeds: [embed]});

      for(let i = 1; i < options.length; i++){
        let emoji = emojis[i-1]; 
        await message.react(emoji);
      }

      await interaction.editReply('Poll créé');
  }

  if (commandName === 'roll'){
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
    
    // Envoyer l'embed dans le channel
    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);