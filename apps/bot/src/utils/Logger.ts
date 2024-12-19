import chalk from 'chalk'

interface LogOptions {
	labelText: string,
	labelColor: string,
	outputData: boolean
}

export class Logger {
	private static log(message: string, data: any, options: LogOptions): void {
		const date = new Date()

		console.log([
			this.getFormattedDate(date),
			// @ts-expect-error
			chalk[options.labelColor](options.labelText.padStart(7)),
			message
		].join('  '))

		if(options.outputData) {
			console.log(data)
		}
	}


	static info(message: string, data?: any) {
		this.log(message, data, {
			labelColor: 'blue',
			labelText: 'info',
			outputData: arguments.length === 2
		})
	}

	static wait(message: string, data?: any) {
		this.log(message, data, {
			labelColor: 'cyan',
			labelText: 'wait',
			outputData: arguments.length === 2
		})
	}

	static ready(message: string, data?: any) {
		this.log(message, data, {
			labelColor: 'green',
			labelText: 'ready',
			outputData: arguments.length === 2
		})
	}

	static warning(message: string, data?: any) {
		this.log(message, data, {
			labelColor: 'yellow',
			labelText: 'warning',
			outputData: arguments.length === 2
		})
	}

	static error(message: string, data?: any) {
		this.log(message, data, {
			labelColor: 'red',
			labelText: 'error',
			outputData: arguments.length === 2
		})
	}

	static debug(message: string, data?: any) {
		if(!process.env.DEBUG) return
		this.log(message, data, {
			labelColor: 'gray',
			labelText: 'debug',
			outputData: arguments.length === 2
		})
	}
	

	private static getFormattedDate(date: Date) {
		return chalk.gray(Intl.DateTimeFormat('en', dateFormatOptions).format(date).replace(',', ''))
	}
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
	month: '2-digit',
	day: '2-digit',
	year: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false
}