import { Embed, EmbedBuilder } from 'discord.js'
import { Command, CommandOptionTypes } from '../../base/commands/Command'

export default new Command({
	name: 'ping',
	options: [],

	run({ interaction }) {
		interaction.reply({
			embeds: [
				new EmbedBuilder({
					description: `<:e:852619139997499402> Pong!!! My ping is \`${interaction.client.ws.ping}\` ms`,
					color: 0x5357ff
				})
			]
		})
	}
})