import { Command } from '@base/Command'
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { PermissionOverwriteOptions, Permissions, User, VoiceChannel } from 'discord.js'
import { ChannelTypes } from 'discord.js/typings/enums'
import MonoGuildMember from '@base/discord.js/GuildMember'
import user from '@commands/information/user'
import { ActivePrivateRoom } from '@prisma/client'
import { OverwriteResolvable } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'private',
			options: [{
				id: 'default',
				type: CommandOptionTypes.SUB_COMMAND_GROUP,
				options: [{
					id: 'name',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'name',
						type: CommandOptionTypes.STRING,
						required: true
					}]
				}, {
					id: 'limit',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'limit',
						type: CommandOptionTypes.INTEGER,
						minValue: 0,
						maxValue: 99,
						required: true
					}]
				}, {
					id: 'hidden',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'hidden',
						type: CommandOptionTypes.BOOLEAN,
						required: true
					}]
				}, {
					id: 'locked',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'locked',
						type: CommandOptionTypes.BOOLEAN,
						required: true
					}]
				}]
			}, {
				id: 'setup',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'channel',
					type: CommandOptionTypes.CHANNEL,
					channelTypes: [ChannelTypes.GUILD_VOICE],
					required: false
				}]
			}, {
				id: 'name',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'name',
					type: CommandOptionTypes.STRING,
					required: true
				}]
			}, {
				id: 'limit',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'limit',
					type: CommandOptionTypes.INTEGER,
					minValue: 0,
					maxValue: 99,
					required: true
				}]
			}, {
				id: 'hidden',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'hidden',
					type: CommandOptionTypes.BOOLEAN,
					required: true
				}]
			}, {
				id: 'locked',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'locked',
					type: CommandOptionTypes.BOOLEAN,
					required: true
				}]
			}, {
				id: 'kick',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'user',
					type: CommandOptionTypes.USER,
					required: true
				}]
			}, {
				id: 'transfer',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'user',
					type: CommandOptionTypes.USER,
					required: true
				}]
			}],
			module: 'privateRooms',
			botPermissionsRequired: ['MOVE_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_ROLES']
		})
	}

	async execute({ interaction, t }: CommandContext, { subCommand, subCommandGroup, ...options }: CommandOptions) {
		const privateRoomsModule = (interaction.guild as MonoGuild).modules.privateRooms

		const member = await this.guild.members.fetch(interaction.user)

		if(subCommand === 'setup') {
			if(!member.permissions.has('MANAGE_GUILD')) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('noPermissions'))]
				})
				return
			}

			// If channel not specified, create it automatically
			if(!options.channel) {
				if(!interaction.guild!.me!.permissions.has('MANAGE_CHANNELS')) {
					await interaction.reply({
						embeds: [new ErrorEmbed(t('cantCreateChannel'))]
					})
					return
				}

				const joinChannelCategoryCreated = await interaction.guild!.channels.create(
					t('newJoinChannelCategoryName'),
					{ type: 'GUILD_CATEGORY' }
				)
				const joinChannelCreated = await interaction.guild!.channels.create(
					t('newJoinChannelName'),
					{ type: 'GUILD_VOICE', parent: joinChannelCategoryCreated }
				);

				await privateRoomsModule.setJoinChannelId(joinChannelCreated.id)

				await interaction.reply({
					embeds: [new SuccessEmbed(t('joinChannelCreated', { channel: joinChannelCreated }))]
				})
				return
			}

			// Otherwise, use specified channel
			await privateRoomsModule.setJoinChannelId(options.channel!.id)

			await interaction.reply({
				embeds: [new SuccessEmbed(t('joinChannelChanged', { channel: options.channel }))]
			})
			return
		}

		// Default settings
		if(subCommandGroup === 'default') {
			if(!member.permissions.has('MANAGE_GUILD')) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('noPermissions'))]
				})
				return
			}

			if(subCommand === 'name') {
				await privateRoomsModule.setDefaultName(options.name!)

				await interaction.reply({
					embeds: [new SuccessEmbed(t('defaultNameChanged', { channel: options.channel }))]
				})
				return
			}

			if(subCommand === 'limit') {
				await privateRoomsModule.setDefaultLimit(options.limit!)

				await interaction.reply({
					embeds: [new SuccessEmbed(t(
						options.limit
							? 'defaultLimitChanged'
							: 'defaultLimitDisabled',
						{ limit: options.limit }
					))]
				})

				return
			}

			if(subCommand === 'hidden') {
				await privateRoomsModule.setDefaultHidden(options.hidden!)

				await interaction.reply({
					embeds: [new SuccessEmbed(t(
						options.hidden
							? 'defaultHidden'
							: 'defaultShown'
					))]
				})
				return
			}

			if(subCommand === 'locked') {
				await privateRoomsModule.setDefaultLocked(options.locked!)

				await interaction.reply({
					embeds: [new SuccessEmbed(t(
						options.hidden
							? 'defaultLocked'
							: 'defaultOpened'
					))]
				})
				return
			}
		}

		// Host actions

		let currentChannel

		try {
			currentChannel = (interaction.member as MonoGuildMember).voice.channel as VoiceChannel

			// If user is not in voice
			if(!currentChannel) {
				await interaction.reply({
					embeds: [new InfoEmbed(t('mustBeInRoom'))]
				})
				return
			}
		} catch(e) {
			await interaction.reply({
				embeds: [new InfoEmbed(t('mustBeInRoom'))]
			})
			return
		}


		const privateRoom = await this.client.database.activePrivateRoom.findFirst({
			where: {
				channelId: currentChannel.id
			}
		})

		// If user is in voice, but not a private room
		if(!privateRoom) {
			await interaction.reply({
				embeds: [new InfoEmbed(t('notInRoom'))]
			})
			return
		}

		// If user is not a host
		if(interaction.user.id !== privateRoom.hostId) {
			await interaction.reply({
				embeds: [new InfoEmbed(t('notHost'))]
			})
			return
		}

		if(subCommand === 'name') {
			await currentChannel.setName(options.name!)
			await interaction.reply({
				embeds: [new SuccessEmbed(t('nameChanged'))]
			})
			return
		}

		if(subCommand === 'limit') {
			await currentChannel.edit({
				userLimit: options.limit
			})
			await interaction.reply({
				embeds: [new SuccessEmbed(t(
					options.limit
						? 'limitChanged'
						: 'limitDisabled',
					{ limit: options.limit }
				))]
			})
			return
		}

		if(subCommand === 'hidden') {
			const privateRoomData = await this.client.database.activePrivateRoom.update({
				where: {
					channelId: currentChannel.id
				},
				data: {
					hidden: options.hidden!
				}
			})

			await updatePrivateRoom(currentChannel, privateRoomData, (interaction.member! as MonoGuildMember))

			await interaction.reply({
				embeds: [new SuccessEmbed(t(
					options.hidden
						? 'hidden'
						: 'shown'
				))]
			})
			return
		}

		if(subCommand === 'locked') {
			const privateRoomData = await this.client.database.activePrivateRoom.update({
				where: {
					channelId: currentChannel.id
				},
				data: {
					locked: options.locked!
				}
			})

			await updatePrivateRoom(currentChannel, privateRoomData, (interaction.member! as MonoGuildMember))

			await interaction.reply({
				embeds: [new SuccessEmbed(t(
					options.hidden
						? 'locked'
						: 'opened'
				))]
			})
			return
		}

		if(subCommand === 'transfer') {
			if(options.user!.bot) {
				await interaction.reply({
					embeds: [new InfoEmbed(t('cantTransferToBot'))]
				})
				return
			}

			await currentChannel.permissionOverwrites.edit(options.user!, {
				VIEW_CHANNEL: true,
				MANAGE_CHANNELS: true,
				CONNECT: true
			})

			await currentChannel.permissionOverwrites.delete(interaction.user)

			await this.client.database.activePrivateRoom.update({
				where: {
					channelId: currentChannel.id
				},
				data: {
					hostId: options.user!.id
				}
			})

			await interaction.reply({
				embeds: [new SuccessEmbed(t('transferred', {
					oldHost: interaction.user,
					newHost: options.user
				}))]
			})
		}
	}
}

interface CommandOptions {
	subCommand: 'setup'  | 'name' | 'limit' | 'hidden' | 'locked' | 'kick' | 'transfer',
	subCommandGroup?: 'default' | 'name' | 'limit' | 'hidden' | 'locked',
	name?: string,
	limit?: number,
	hidden?: boolean,
	locked?: boolean,
	user?: User,
	channel?: VoiceChannel
}

async function updatePrivateRoom(channel: VoiceChannel, privateRoomData: ActivePrivateRoom, member: MonoGuildMember) {
	const permissionOverwrites: OverwriteResolvable[] = [{
		id: channel.client.user!.id,
		type: 'member',
		allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
	}, {
		id: member.user.id,
		type: 'member',
		allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
	}, {
		id: channel.guild.roles.everyone.id,
		type: 'role',
		allow: [],
		deny: []
	}]

	if(privateRoomData.hidden) {
		// @ts-ignore
		permissionOverwrites[2].deny.push('VIEW_CHANNEL')
	} else {
		// @ts-ignore
		permissionOverwrites[2].allow.push('VIEW_CHANNEL')
	}

	if(privateRoomData.locked) {
		// @ts-ignore
		permissionOverwrites[2].deny.push('CONNECT')
	} else {
		// @ts-ignore
		permissionOverwrites[2].allow.push('CONNECT')
	}

	await channel.edit({
		permissionOverwrites
	})
}
