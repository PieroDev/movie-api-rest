import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGO_DATABASE_URL

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('sample_mflix')
    return database.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class MovieModel {
  static async getAll ({ genre }) {
    const db = await connect()
    if (genre) {
      return db.find({
        genres: {
          $elemMatch: {
            $regex: genre,
            $options: 'i'
          }
        }
      }).limit(20).toArray()
    }

    return db.find({}).limit(20).toArray()
  }
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
