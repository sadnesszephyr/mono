import * as dotenv from 'dotenv'
import * as path from 'path'
import { MonoClient } from './base/MonoClient'
import { Logger } from './utils/Logger'
import { readStoreFile, writeStoreFile } from './utils/store'
import '@total-typescript/ts-reset'

dotenv.config({
	path: path.resolve(__dirname, '../../../.env')
})

console.log('reloaded')

const client = new MonoClient()

client.launch()
