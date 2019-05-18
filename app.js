const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const { searchResultsApi, bookDescriptionApi } = require('./goodreads')

const app = express()
const { PORT = 3000 } = process.env

app.use(morgan('combined', {skip: (_, res) => res.statusCode < 400 }))

app.use(cors({optionsSuccessStatus: 200}))

app.get('/search', searchResultsApi)

app.get('/bookdescription/:id', bookDescriptionApi)

app.use((_, res) => res.status(404).send(
  `Sorry can't find that!
  Try '/search?q=<book name>'
  or '/bookdescription/<bookid>'`
))

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
