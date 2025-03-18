import { createApp } from './app.js'
import { MovieModel } from './models/mongoDb/movie.js'

console.log('asd')
createApp({ movieModel: MovieModel })
