[@zokugun/dynopl](https://github.com/zokugun/dynopl)
====================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/dynopl.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/dynopl)

[DynoPL](https://github.com/zokugun/dynopl) is an open format for dynamic/smart playlists of songs.

Getting Started
---------------

With [node](http://nodejs.org) previously installed:

	npm install @zokugun/dynopl

### Type

```typescript
import type { Playlist } from '@zokugun/dynopl';
```

### JSON Schema

```typescript
import schema from '@zokugun/dynopl/lib/dynopl.schema.json';
```

Example: Recent favorite rock songs
-----------------------------------

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

License
-------

Copyright &copy; 2025-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
