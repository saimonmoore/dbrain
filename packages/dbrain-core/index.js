import schemas from './schemas/index.js'
import { publicCitizenDbExtension, privateCitizenDbExtension,  publicCommunityDbExtension } from './db/index.js'
import { apiExtension } from './api/index.js'

export default { schemas, publicCitizenDbExtension, privateCitizenDbExtension, publicCommunityDbExtension };
