import { Client } from 'discord.js'
import { glob } from 'glob'
import { ReplaceType } from '../../typings/types'
import Listener from '../Listener'
import { MonoClient } from '../MonoClient'

export async function setupListeners(client: MonoClient) {
	const listenersPaths = await glob('src/listeners/**/*.{js,ts}')

	for (const path of listenersPaths) {
		const listener = require(`$../../../${path}`).default as Listener
		const { event, run } = listener

		client.on(event, (...args) => {
			run(...args) //as ReplaceType<typeof args, Client, MonoClient>)
		})
	}
}