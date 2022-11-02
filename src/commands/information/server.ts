import { Command } from '@base/Command'
import { MonoEmbed, ErrorEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import discordAvatars from '../../assets/discordAvatars'
import { formatTimestamp, formatUser } from '@utils/formatters'
import emojis from '../../assets/emojis'
import { CommandCategory } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'server',
			options: [],
			category: CommandCategory.INFORMATION
		})
	}

	async execute({ interaction, t }: CommandContext) {
		const { guild } = interaction

		if(!guild) {
			await interaction.reply({
				embeds: [new ErrorEmbed(t('guildNotFound'))]
			})
			return
		}

		const owner = await this.client.users.fetch(guild.ownerId)
		const { memberCount } = guild

		await interaction.reply({
			embeds: [
				new MonoEmbed()
					.setTitle(guild.name)
					.setThumbnail(guild.iconURL({ forceStatic: false, extension: 'png' }) || discordAvatars.fromId(guild.id))
					.addField(t('owner'), formatUser(owner), true)
					.addField(t('created'), formatTimestamp(guild.createdTimestamp), true)
					.addField(t('members'), `${memberCount} ${emojis.user}`)

			]
		})
	}
}
