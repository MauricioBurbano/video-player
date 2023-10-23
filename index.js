import express from 'express'
import axios from 'axios'
import { readFile } from 'node:fs';

const app = express()
const port = 3000

let key = ''

readFile('key.json', 'utf8', (err, data) => {
  if (err) throw err;
  key = JSON.parse(data).key;
});

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=cat&key=${key}`)
        res.render('index.ejs', {title: response.data.items[0].snippet.title})
    } catch(error) {
        console.error(error)
        res.render('index.ejs', {title: 'error'})
    }
    console.log()
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})