import * as localForage from 'localforage'

import Dexie from 'dexie'

export const dx = new Dexie('ENdexi')
dx.version(1).stores({
  projects: `id++, projectJSON, name, dateUpdated, dateCreated`
})

export const lf = localForage.createInstance({
  name: 'en-db'
})
