import path from 'path'
import { Seeder } from 'mongo-seeding'
import { MONGO_URI } from '../config'
import { SeederCollection } from 'mongo-seeding/dist/common';

const config = {
  database: MONGO_URI,
  dropCollections: true,
  databaseReconnectTimeout: 10000,
  dropDatabase: true,
}

const seeder: Seeder = new Seeder(config);

(async () => {
  const collections: SeederCollection[] = seeder.readCollectionsFromPath(
    path.resolve('./src/seeders/seeds'),
    {
      extensions: ['json', 'ts']
  })

  try {
    await seeder.import(collections);
    console.log('DB seeded!')
  } catch (err) {
    console.log(err)
  }
})()
