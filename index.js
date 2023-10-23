import express from 'express'
import axios from 'axios'
import { readFile } from 'node:fs';

const app = express()
const port = 3000

app.use(express.urlencoded())

let key = ''

readFile('key.json', 'utf8', (err, data) => {
  if (err) throw err;
  key = JSON.parse(data).key;
});

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/', async (req, res) => {
    const querry = req.body.search

    try {
        const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${querry}&key=${key}`)
        console.log(response.data.items[0].snippet.thumbnails.high)
        res.render('index.ejs', {response: response})
    } catch(error) {
        console.error(error)
        res.render('index.ejs', {title: 'error'})
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})