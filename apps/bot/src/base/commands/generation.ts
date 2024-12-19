import { ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputApplicationCommandData, Collection } from 'discord.js'
import { Command, CommandOption, CommandOptionTypes } from './Command'

export function generateCommands(commands: Collection<string, Command>): ChatInputApplicationCommandData[] {
	return commands.map((command) => {
		if(command.disabledGlobally) return

		return {
			name: command.name,
			description: command.name,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: command.memberDefaultPermissions,
			options: generateOptions(command.options)
		} as ChatInputApplicationCommandData
	}).filter(Boolean)
}

function generateOptions(options: CommandOption[]): ApplicationCommandOptionData[] {
	// TODO
	// @ts-expect-error
	return options.map((option) => ({
		name: option.name,
		description: option.name,
		type: customToNativeOptionsMap.get(option.type)!,
		options: generateOptions(option.options ?? [])
	}))
}

const customToNativeOptionsMap: Map<CommandOptionTypes, ApplicationCommandOptionType> = new Map([
	[CommandOptionTypes.SUBCOMMAND, ApplicationCommandOptionType.Subcommand],
	[CommandOptionTypes.SUBCOMMAND_GROUP, ApplicationCommandOptionType.SubcommandGroup],
	[CommandOptionTypes.STRING, ApplicationCommandOptionType.String],
	[CommandOptionTypes.INTEGER, ApplicationCommandOptionType.Integer],
	[CommandOptionTypes.NUMBER, ApplicationCommandOptionType.Number],
	[CommandOptionTypes.BOOLEAN, ApplicationCommandOptionType.Boolean],
	[CommandOptionTypes.USER, ApplicationCommandOptionType.User],
	[CommandOptionTypes.CHANNEL, ApplicationCommandOptionType.Channel],
	[CommandOptionTypes.ROLE, ApplicationCommandOptionType.Role],

	[CommandOptionTypes.MESSAGE, ApplicationCommandOptionType.String],
	[CommandOptionTypes.EMOJI, ApplicationCommandOptionType.String],
	[CommandOptionTypes.DURATION, ApplicationCommandOptionType.Number],
	[CommandOptionTypes.COMMAND, ApplicationCommandOptionType.String],
	[CommandOptionTypes.MODULE, ApplicationCommandOptionType.String],
	[CommandOptionTypes.MESSAGE_CONFIG, ApplicationCommandOptionType.String]
])