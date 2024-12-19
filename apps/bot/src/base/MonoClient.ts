// import chalk from 'chalk'
import { Client, Collection, IntentsBitField } from 'discord.js'
import { glob } from 'glob'
import { Logger } from '../utils/Logger'
import { readStoreFile, writeStoreFile } from '../utils/store'
import MiddlewareManager from './MiddlewareManager'
import { Command } from './commands/Command'
import { generateCommands } from './commands/generation'
import { setupListeners } from './handlers/event'

export class MonoClient extends Client<true> {
	public commands: Collection<string, Command> = new Collection()
	public middlewareManager = new MiddlewareManager()

	constructor() {
		super({
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.MessageContent
			]
		})
	}

	async launch() {
		const commandPaths = await glob('src/commands/**/*.{js,ts}')

		for(const path of commandPaths) {
			const { default: command }: { default: Command } = await import(`../../${path.replace(/\\/g, '/')}`)
			this.commands.set(command.name, command)
		}

		await this.login()
		await setupListeners(this)
	}

	async setup() {
		Logger.wait('Setting up')

		const commandsCache = await readStoreFile('commandsCache.json', this.commands) as unknown[]
		
		const currentCommandsNames = [...this.commands.keys()]
		const cacheCommandsNames = commandsCache.map((command: any) => command.name as string)

		const deletedCommandsIds = cacheCommandsNames
			.filter((id) => !currentCommandsNames.includes(id))
		const addedCommandsIds = currentCommandsNames
			.filter((id) => !cacheCommandsNames.includes(id))
		const modifiedCommandsIds = currentCommandsNames
			.filter((id) => !addedCommandsIds.includes(id))
			.filter(id => JSON.stringify(commandsCache.find((cmd: any) => cmd.name === id)) !== JSON.stringify(this.commands.get(id)))
		
		if(deletedCommandsIds.length || modifiedCommandsIds.length || addedCommandsIds.length) {
			this.mainGuild.commands.set(generateCommands(this.commands))
			writeStoreFile('commandsCache.json', this.commands)
			Logger.info('Uploaded new commands and updated cache')
		}
	}

	get mainGuild() {
		return this.guilds.cache.get(process.env.MAIN_GUILD_ID!)!
	}
}
