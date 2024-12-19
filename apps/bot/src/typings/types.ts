// https://stackoverflow.com/a/72190984/13295313
export type ReplaceType<Type, FromType, ToType> = Type extends FromType
	? ToType
	: Type extends object
	? ReplaceTypes<Type, FromType, ToType>
	: Type

export type ReplaceTypes<ObjType extends object, FromType, ToType> = {
	[KeyType in keyof ObjType]: ReplaceType<ObjType[KeyType], FromType, ToType>
}


export type JSONValue =
    | string
    | number
    | boolean
	| null
    | { [key: string]: JSONValue }
    | Array<JSONValue>;