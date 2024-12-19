import fs from 'fs'
import { Logger } from './Logger'

if(!fs.existsSync('.mono')) {
	fs.mkdirSync('.mono')
}

type StoreReadValue<T> = T extends `${string}.json` ? unknown : string

export async function readStoreFile<T extends string>(fileName: T, defaultValue?: StoreReadValue<T>): Promise<StoreReadValue<T>> {
	if(!fs.existsSync(`.mono/${fileName}`)) {
		Logger.info(`Created empty \`.mono/${fileName}\` storage file.`)

		if(fileName.endsWith('.json')) {
			fs.writeFileSync(`.mono/${fileName}`, JSON.stringify(defaultValue ?? {}))
			return defaultValue ?? {} as StoreReadValue<T>
		} else {
			fs.writeFileSync(`.mono/${fileName}`, defaultValue ?? '')
			return defaultValue ?? ''
		}
	}

	const fileContent = fs.readFileSync(`.mono/${fileName}`, { encoding: 'utf8' })

	if(fileName.endsWith('.json')) {
		return JSON.parse(fileContent) as StoreReadValue<T>
	} else {
		return fileContent
	}
}


type StoreWriteContent<T> = T extends `${string}.json` ? unknown : string

interface StoreWriteOptions {
	ignoreIfExists: boolean
}

export async function writeStoreFile<T extends string>(fileName: T, content: StoreWriteContent<T>, options?: StoreWriteOptions) {
	if(options?.ignoreIfExists && fs.existsSync(`.mono/${fileName}`)) return

	fs.writeFileSync(
		`.mono/${fileName}`,
		fileName.endsWith('.json')
			? JSON.stringify(content)
			: content
	)
}