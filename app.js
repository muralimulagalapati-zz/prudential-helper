const qs = require('querystring')
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const convert = require('xml-js')

const app = express()
const host = 'https://www.goodreads.com'
const key = 'ODgzR3MZCnBiqE1w39MPzQ'
const convertOpts = {compact: true, trim: true}
const { PORT = 3000 } = process.env

app.use(morgan('combined', {skip: (_, res) => res.statusCode < 400 }))

app.use(cors({optionsSuccessStatus: 200}))

app.get('/search', async (req, res) => {
  const { q } = req.query
  const query = qs.stringify({ q, key, search: 'title' })
  const url = `${host}/search?${query}`
  try {
    const response = await axios.get(url)
    const result = convert.xml2js(response.data, convertOpts)
    res.json(result)
  } catch (ex) {
    console.error(ex)
    res.status(404).send(ex)
  }
})

app.get('/book/:id', async (req, res) => {
  const { id } = req.params
  const query = qs.stringify({ id, key, text_only: true})
  const url = `${host}/book/show?${query}`
  try {
    const response = await axios.get(url)
    const result = convert.xml2js(response.data, convertOpts)
    res.json(result)
  } catch (ex) {
    console.error(ex)
    res.status(404).send(ex)
  }
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
