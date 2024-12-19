import { Embed, EmbedBuilder, GuildMember } from 'discord.js'
import { Command, CommandOptionTypes } from '../../base/commands/Command'

export default new Command({
	name: 'user',
	options: [{
		name: 'user',
		type: CommandOptionTypes.USER
	}],

	async run({ interaction }) {
		const member = interaction.member as GuildMember

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(member.nickname || member.user.username)
					.setThumbnail(member.user.avatarURL({
						size: 1024,
						extension: 'png',
						forceStatic: false
					}))
			]
		})
	}
})