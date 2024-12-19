import { ChannelType, CommandInteraction, PermissionResolvable } from 'discord.js'

export interface CommandData {
	name: string,
	options: CommandOption[],
	botPermissionsRequired?: PermissionResolvable[],
	memberDefaultPermissions?: PermissionResolvable[],
	disabledGlobally?: boolean,
	staffOnly?: boolean
	run(context: CommandContext): void
}

export class Command {
	name: string
	options: CommandOption[]
	botPermissionsRequired?: PermissionResolvable[]
	memberDefaultPermissions?: PermissionResolvable[]
	disabledGlobally?: boolean
	staffOnly?: boolean
	run: (context: CommandContext) => void

	constructor(data: CommandData) {
		this.options = data.options
		this.name = data.name
		this.botPermissionsRequired = data.botPermissionsRequired
		this.memberDefaultPermissions = data.memberDefaultPermissions
		this.staffOnly = data.staffOnly
		this.run = data.run
	}
}


export interface CommandOption {
	name: string,
	type: CommandOptionTypes
	choices?: CommandOptionChoice[],
	options?: CommandOption[]
	required?: boolean,
	channelTypes?: ChannelType[],
	minValue?: number,
	maxValue?: number,
	autocomplete?: boolean
}

export interface CommandOptionChoice {
	name: string,
	value: string | number
}

export interface CommandContextOptions {
	subCommand: string | null,
	subCommandGroup: string | null,
	[option: string]: any
}


export enum CommandCategory {

}

export enum CommandOptionTypes {
	SUBCOMMAND = 'subCommand',
	SUBCOMMAND_GROUP = 'subCommandGroup',
	STRING = 'string',
	INTEGER = 'integer',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	USER = 'user',
	CHANNEL = 'channel',
	MESSAGE = 'message',
	ROLE = 'role',
	EMOJI = 'emoji',
	DURATION = 'duration',
	COMMAND = 'command',
	MODULE = 'module',
	MESSAGE_CONFIG = 'messageConfig'
}

export interface CommandContext {
	interaction: CommandInteraction
}