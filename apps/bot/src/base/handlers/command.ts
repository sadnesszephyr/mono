import { CommandInteraction } from 'discord.js'
import { glob } from 'glob'
import { Command } from '../commands/Command'

export async function handleCommand(interaction: CommandInteraction) {
	const commands = await getCommands()
	const evokedCommand = commands.find((command) => command.name === interaction.commandName)
	
	evokedCommand?.run({
		interaction
	})
}

async function getCommands(): Promise<Command[]> {
	const commands = []
	const commandPaths = await glob('src/commands/**/*.{js,ts}')

	for(const path of commandPaths) {
		const commandFileModule = await import(`../../../${path.replace(/\\/g, '/')}`)
		commands.push(commandFileModule.default as Command)
	}

	return commands
}