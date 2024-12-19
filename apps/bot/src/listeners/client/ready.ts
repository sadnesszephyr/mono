import chalk from 'chalk'
import Listener from '../../base/Listener'
import { Logger } from '../../utils/Logger'
import { MonoClient } from '../../base/MonoClient'

export default new Listener({
	event: 'ready',
	async run(client) {
		Logger.ready(`Logged in as \`${client.user.username}\``)

		await (client as MonoClient).setup()
	}
})