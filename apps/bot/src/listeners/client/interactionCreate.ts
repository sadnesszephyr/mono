import { CommandInteraction } from 'discord.js'
import { glob } from 'glob'
import { Command } from '../../base/commands/Command'
import Listener from '../../base/Listener'
import { handleCommand } from '../../base/handlers/command'

export default new Listener({
	event: 'interactionCreate',
	async run(interaction) {
		if(interaction instanceof CommandInteraction) {
			handleCommand(interaction)
		}
	}
})