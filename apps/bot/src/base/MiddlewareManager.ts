import { CommandInteraction } from 'discord.js'
import { Command, CommandContext, CommandContextOptions } from './commands/Command'

interface MiddlewareContext {
	interaction: CommandInteraction,
	command: Command,
	commandContext: CommandContext,
	commandOptions: CommandContextOptions
}

type MiddlewareFunction = (context: MiddlewareContext) => Promise<MiddlewareResult>

export enum MiddlewareResult {
	BREAK = 'break',
	NEXT = 'next'
}

export default class MiddlewareManager {
	middlewareFunctions: MiddlewareFunction[] = []

	constructor() {
		// Middleware should be here...
	}

	private use(middlewareFunction: MiddlewareFunction) {
		this.middlewareFunctions.push(middlewareFunction)
	}

	async handle(context: MiddlewareContext) {
		for(const mwFunction of this.middlewareFunctions) {
			const result = await mwFunction(context)
			if(result === MiddlewareResult.BREAK) return MiddlewareResult.BREAK
		}
		return MiddlewareResult.NEXT
	}
}