import schemas from './schemas/index.js'
import { publicCitizenDbExtensions, privateCitizenDbExtensions,  publicCommunityDbExtensions } from './db/index.js'
import { apiExtensions } from './api/index.js'
import { appExtensions } from './app/index.js'

export default {
  apiExtensions,
  appExtensions,
  privateCitizenDbExtensions,
  publicCitizenDbExtensions,
  publicCommunityDbExtensions,
  schemas
};
