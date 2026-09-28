//Obsolète car fonctionnalité rajouté de base sur ds

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