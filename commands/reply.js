import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reply')
        .setDescription('Reply to ticket (General Support)')
        .addStringOption(option =>
            option.setName('response')
                .setDescription('The response to send')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.channel.parentId != '1302439814007619678') {
            return interaction.reply('This command can only be used in general tickets.');
        }

        const mainServer = interaction.client.guilds.cache.get(process.env.GUILDID);

        // Get the response message from the command option
        const response = interaction.options.getString('response');
        
        // Retrieve the user associated with the ticket channel (stored in the channel's topic)
        let user = interaction.client.users.cache.get(interaction.channel.topic);
        if (!user) {
            user = await mainServer.members.fetch(interaction.channel.topic);
        }
        
        // Send the response to the user (mentioning the user and including the response)
        user.send(`**[${interaction.member.roles.highest.name}]** <@${interaction.user.id}>: ${response}`);
        
        // Reply to the interaction with the same response, visible to the user who executed the command
        await interaction.reply(`**${interaction.user.username}**: ${response}`);
    }        
}