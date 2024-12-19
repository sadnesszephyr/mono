import { EmbedBuilder, EmbedData } from 'discord.js'

export class MonoEmbed extends EmbedBuilder {
	constructor(data?: EmbedData) {
		if(!data) data = { color: 0x2B2D31 }
		if(!data.color) data.color = 0x2B2D31
		super(data)
	}

	addField(name: string, value: string, inline?: boolean): this {
		this.addFields([{
			name, value, inline
		}])
		return this
	}
}