[DynoPL](https://github.com/zokugun/dynopl)
===========================================

[DynoPL](https://github.com/zokugun/dynopl) is an open format for dynamic/smart playlists of songs.

Table of Contents
-----------------

- [Goals](#goals)
- [Specification](#specification)
- [Explanation](#explanation)
- [Examples](#examples)
    - [Example of a simple playlist that contains tracks with rating >= 4](#example-of-a-simple-playlist-that-contains-tracks-with-rating--4)
    - [Example of a more complex playlist: Recent favorite rock songs](#example-of-a-more-complex-playlist-recent-favorite-rock-songs)
    - [Example of a playlist excluding songs from another playlist](#example-of-a-playlist-excluding-songs-from-another-playlist)
- [Key Points](#key-points)
- [Detailed Explanation of `Rule`](#detailed-explanation-of-rule)
    - [Simple equality check](#simple-equality-check)
    - [Numeric comparisons](#numeric-comparisons)
    - [Text matching](#text-matching)
    - [Date related rules](#date-related-rules)
- [File Extensions](#file-extensions)
- [Inspiration](#inspiration)
- [License](#license)

Goals
-----

The goals are:
- to be shareable between audio players
- to be shareable between friends
- to be human readable

Specification
-------------

```typescript
type Playlist = {
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

type Field = keyof FieldType;

type Rule =
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

type Weighted = {
    weight?: number;
};
```

A JSON Schema can be found at [dynopl.schema.json](https://github.com/zokugun/dynopl/blob/master/dynopl.schema.json)

Explanation
-----------

1. The core type is `Playlist` which represents a dynamic/smart playlist with filtering rules and sorting options.

2. The `Field` type represents all possible fields of a music track that can be used for filtering and sorting.

3. The `Rule` type defines all possible filtering conditions that can be applied.

Examples
--------

### Example of a simple playlist that contains tracks with rating >= 4

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Highly Rated Songs",
    "description": "Songs with rating of 4 or higher",
    "all": [
        {
            "gte": {
                "rating": 4
            }
        }
    ],
    "sort": "rating",
    "order": "desc"
}
```

### Example of a more complex playlist: Recent favorite rock songs

```jsonc
{
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "Recent Favorite Rock",
    "description": "Rock songs added in the last 30 days with high play count or high rating",
    "all": [
        {
            "contains": {
                "genre": "rock"
            }
        },
        {
            "inTheLast": {
                "dateAdded": 30
            }
        },
        {
            "any": [
                {
                    "gte": {
                        "playCount": 5,
                        "weight": 2 // this condition has double importance
                    }
                },
                {
                    "gte": {
                        "rating": 4
                    }
                }
            ]
        }
    ],
    "sort": [
        "dateAdded",
        "rating"
    ],
    "order": "desc",
    "limit": 50
}
```

### Example of a playlist excluding songs from another playlist

```jsonc
{
    "id": "7ba7b810-9dad-11d1-80b4-00c04fd430c9",
    "name": "Unique Jazz Collection",
    "description": "Jazz tracks not in my 'Jazz Favorites' playlist",
    "all": [
        {
            "contains": {
                "genre": "jazz"
            }
        },
        {
            "notInPlaylist": {
                "id": "8ba7b810-9dad-11d1-80b4-00c04fd430c0" // ID of "Jazz Favorites" playlist
            }
        }
    ],
    "sort": "random"
}
```

Key Points
----------

1. The `Field` type is an extensive union of all possible fields that can be used for filtering and sorting. It covers metadata (title, artist), technical details (bitrate, channels), and user interaction data (playCount, rating).

2. Rules can be weighted using the weight property, allowing some conditions to have more importance than others in the filtering process.

3. The sorting system is flexible:

    - Can sort by a single field or multiple fields
    - Can sort randomly using `random`
    - Can specify ascending or descending order
    - Can `limit` and `offset` results for pagination

4. The type system ensures type safety for complex playlist rules while maintaining flexibility through union types and nested structures.

This type system is ideal for implementing a smart playlist feature, allowing for very sophisticated filtering and sorting of music libraries.

Detailed Explanation of `Rule`
------------------------------

The `Playlist` type supports several types of rule combinations:
1. Using `all` - ALL rules must match (AND logic)
2. Using `any` - ANY rule must match (OR logic)
3. Can be nested for complex conditions

### Simple equality check

```json
{
    "is": {
        "genre": "rock",
        "compilation": false
    }
}
```

### Numeric comparisons

```jsonc
{
    "all": [
        {
            "gt": { // Greater than
                "playCount": 10
            }
        },
        {
            "lte": { // Less than or equal
                "rating": 5
            }
        },
        {
            "inTheRange": {// Range check
                "year": [
                    1980,
                    1989
                ]
            }
        }
    ]
}
```

### Text matching

```json
{
    "any": [
        {
            "contains": {
                "title": "love"
            }
        },
        {
            "startsWith": {
                "artist": "The"
            }
        },
        {
            "endsWith": {
                "album": "Collection"
            }
        }
    ]
}
```

### Date related rules

```jsonc
{
    "all": [
        {
            "after": {
                "dateAdded": "2024-01-01"
            }
        },
        {
            "inTheLast": {
                "lastPlayed": 30  // Last 30 days
            }
        },
        {
            "notInTheLast": {
                "dateLoved": 7  // Not in the last week
            }
        }
    ]
}
```

File Extensions
---------------

| Format     | Composed extensions           | Abbreviated extensions |
| ---------- | ----------------------------- | ---------------------- |
| JSON/JSONC | `.dynopl.json`                | `.jdp`                 |
| YAML       | `.dynopl.yaml`, `.dynopl.yml` | `.ydp`                 |
| TOML       | `.dynopl.toml`                | `.tdp`                 |

Inspiration
-----------

This format has been heavily inspired by the smart playlist format found in [Navidrome](https://github.com/navidrome/navidrome/issues/1417).

License
-------

Copyright &copy; 2025-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
