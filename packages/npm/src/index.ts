export type Playlist = {
	id: UUID;
	name?: string;
	description?: string;
	all?: Rule[];
	any?: Rule[];
	sort?: Field[] | Field | 'random';
	order?: 'asc' | 'desc';
	limit?: number;
	offset?: number;
};

export type FieldType = {
	// Track
	comment: string;
	discNumber: number;
	discSubtitle: string;
	discTotal: number;
	genre: string;
	language: string;
	subtitle: string;
	title: string;
	trackNumber: number;
	trackTotal: number;
	year: number;

	// Artist
	artist: string;
	artistCountry: string;
	composer: string;
	conductor: string;
	director: string;
	remixer: string;
	writer: string;

	// Album
	album: string;
	albumArtist: string;
	albumComment: string;
	albumType: string;
	compilation: boolean;
	contentGroup: string;
	country: string;

	// Publishing
	barcode: string;
	catalogNumber: string;
	isrc: string;
	label: string;
	publisher: string;

	// Content
	hasCoverArt: boolean;
	lyrics: string;
	movement: string;
	movementNumber: number;
	movementTotal: number;
	script: string;
	work: string;

	// Technical details
	bitrate: number;
	bpm: number;
	channels: number;
	duration: number;
	filePath: string;
	fileType: string;
	size: number;

	// Sorting fields
	sortAlbum: string;
	sortAlbumArtist: string;
	sortArtist: string;
	sortComposer: string;
	sortTitle: string;

	// User interaction
	dateAdded: string;
	dateLoved: string;
	dateModified: string;
	lastPlayed: string;
	loved: boolean;
	playCount: number;
	rating: number;
	tags: string;
};

export type Field = keyof FieldType;

export type Rule =
	| { all: Rule[] }
	| { any: Rule[] }
	| { is: { [K in Field]: FieldType[K] } & Weighted }
	| { isNot: { [K in Field]: FieldType[K] } & Weighted }
	| { gt: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { lt: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { gte: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { lte: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { contains: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { notContains: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { startsWith: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { endsWith: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { inTheRange: { [K in Field]: [Extract<FieldType[K], number>, Extract<FieldType[K], number>] } & Weighted }
	| { before: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { after: { [K in Field]: Extract<FieldType[K], string> } & Weighted }
	| { inTheLast: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { notInTheLast: { [K in Field]: Extract<FieldType[K], number> } & Weighted }
	| { inPlaylist: { id: UUID } & Weighted }
	| { notInPlaylist: { id: UUID } & Weighted };

export type Weighted = {
	weight?: number;
};

/**
 * UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * where x is any hexadecimal digit.
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
