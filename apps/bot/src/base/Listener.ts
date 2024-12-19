import { Client, ClientEvents } from 'discord.js'
import { MonoClient } from './MonoClient'
import { ReplaceType } from '../typings/types'

type runFunction<E extends keyof ClientEvents> = (
	...args: ClientEvents[E] //ReplaceType<ClientEvents[E], Client, MonoClient>
) => void

export default class Listener<E extends keyof ClientEvents = keyof ClientEvents> {
	event: E
	run: runFunction<E>

	constructor(options: { event: E; run: runFunction<E>; once?: boolean }) {
		this.event = options.event
		this.run = options.run
	}
}