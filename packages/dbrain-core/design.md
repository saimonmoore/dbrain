# dBrain-core

## Requirements

- decentralized
- local
- local first
- offline
- community-based
- sync across all own devices
- sync with friends in community
- dumb clients (web, mobile, desktop)
- ctzn servers (rpc api via websockets + hypercore)
- web/desktop clients: rpc via websockets
- mobile client: hypercore

## Features

- collections
- tags
- filters
- full text search
- nested collections
- suggested tags
- merge tags
- duplicates & broken links
- multiple views (grid, headlines, list)
- instant preview
- share collections with individuals, community
- upload media & files
- batch processing



---


## Schemas

### Memory (aka bookmark aka raindrop)

| Field         | Type           | Description         |
| --------      | --------       | -----------         |
| id            | Integer        | Unique identifier   |
| link          | String         | Hostname of a link. |
| excerpt       | String         | Description; max length: 10000 |
| text          | String         | Content markup; max length: 65000 |
| domain        | String         | Hostname of a link. |
| title         | String         | Title; max length: 1000 |
| type          | Enum           | link article image video document or audio |
| created_at    | Timestamp      | Create timestamp |
| updated_at    | Timestamp      | Update timestamp |
| tags          | Array<Integer> | Tags list   |
| collection_id | Integer        | Collection it belongs to |
| creator_id    | Integer        | User who created it |
| broken        | Boolean        | Original link is not reachable |
| favourite     | Boolean        | Favourited within collection |
| shortcut      | String         | shortcut to copy to clipboard |


### Collection

| Field         | Type           | Description         |
| --------      | --------       | -----------         |
| id            | Integer        | Unique identifier   |
| colour        | String         | Primary color of collection cover as HEX |
| description   | String         | Description; max length: 10000 |
| view          | Enum           | list, simple, grid |
| title         | String         | Title of collection; max length: 1000 |
| created_at    | Timestamp      | Create timestamp |
| updated_at    | Timestamp      | Update timestamp |
| count         | Integer        | Count of memories in collection |
| creator_id    | Integer        | User who created it |
| parent_id     | Integer        | The id of the parent collection. Not specified for root collections |
| sort         | Integer        | sort order within subcollection  |
| expanded        | Boolean        | Whether the collection’s sub-collections are expanded |
| favourite     | Boolean        | Favourite collection |
| public        | Boolean        | Available to all |

### Tag
| Field         | Type           | Description         |
| --------      | --------       | -----------         |
| id            | Integer        | Unique identifier   |
| colour        | String         | Primary color of collection cover as HEX |
| name          | String         | Name of tag |
| created_at    | Timestamp      | Create timestamp |
| updated_at    | Timestamp      | Update timestamp |

### Filter
| Field         | Type           | Description         |
| --------      | --------       | -----------         |
| id            | Integer        | Unique identifier   |
| broken        | Boolean        | Wether memory link is broken or not |
| favourite     | Boolean        | Wether memory is favourite |
| no_tag        | Boolean        | Wether memory has tag |
| tags          | Array<Integer> | Tags list |
| types         | Array<String>  | Memory type list |
| created_at    | Timestamp      | Create timestamp |
| updated_at    | Timestamp      | Update timestamp |
