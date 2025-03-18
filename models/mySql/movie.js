// import { UUID } from 'mongodb'
import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'moviesdb'
}

const connString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connString)

export class MovieModel {
  static async getAll ({ genre }) {
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie')
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [id])
    if (movies.length === 0) return null

    return [movies[0]]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // To do: ADD GENRES

    const [newUuid] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = newUuid
    // console.log({ uuid })
    try {
      await connection.query(`
            INSERT INTO movie (id, title, year, director, duration, poster, rate)
                VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);
            `, [uuid, title, year, director, duration, poster, rate])
    } catch (e) {
      throw new Error('Error creating movie')
      // sendlog(e)
    }

    const [movie] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [uuid])
    return [movie[0]]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
