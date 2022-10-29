export enum CommandOptionTypes {
    SUB_COMMAND,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    NUMBER,
    BOOLEAN,
    USER,
    CHANNEL,
    MESSAGE,
    ROLE,
	MENTIONABLE,
	ATTACHMENT,
    EMOJI,
    DURATION,
    COMMAND,
    MODULE,
    MESSAGE_CONFIG
}

export enum MiddlewareResult {
	BREAK,
	NEXT
}

export enum ReactionRolesMessageMode {
	STANDARD,
	UNIQUE,
	ADD_ONLY,
	REMOVE_ONLY
}
