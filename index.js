import express from 'express'
import axios from 'axios'
import { readFile } from 'node:fs/promises';

const app = express()
const port = 3000

async function getKey() {
    try {
        const filePath = new URL('./key.json', import.meta.url);
        const contents = await readFile(filePath, { encoding: 'utf8' });
        return JSON.parse(contents).key;
      } catch (err) {
        console.error(err.message);
      }
}

app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/', async (req, res) => {
    const config = {
        method: 'get',
        baseURL: 'https://youtube.googleapis.com/youtube/v3/search',
        params: {
            part: 'snippet',
            maxResults: '25',
            key: await getKey(),
            q: req.body.search
        }
    }

    try {
        const response = await axios(config)
        // console.log(response.data.items[0].id)
        res.render('index.ejs', {response: response.data.items})
    } catch(error) {
        console.error(error)
        res.render('index.ejs', {error: error})
    }
})

app.post('/video', (req, res) => {

    res.render('player.ejs', {videoId: req.body.videoId})
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})