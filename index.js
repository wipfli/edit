const express = require('express')
const jwt = require('express-jwt')
const Influx = require('influx')
const cors = require('cors')

const influx = new Influx.InfluxDB({
    database: 'ballometer',
    host: 'localhost'
})

const app = express()
app.use(express.json())
app.use(cors())

app.listen(process.env.PORT, () => {
    console.log('Edit service running on port ' + String(process.env.PORT))
})

const isAlphabetic = text => /^[a-zA-Z]+$/.test(text)
const isNumeric = text => /^[0-9]+$/.test(text)

const deleteFlight = async (username, flightId) => {
    const query = `DELETE FROM ballometer WHERE username = \'${username}\' AND flight_id = \'${flightId}\'`
    await influx.query(query)
}

app.post('/deleteFlight', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), (req, res) => {
    if (req.user.username !== req.query.username) {
        return res.sendStatus(403)
    }
    if (!req.query.username || !isAlphabetic(req.query.username)){
        return res.sendStatus(400)
    }
    if (!req.query.flightId || !isNumeric(req.query.flightId)) {
        return res.sendStatus(400)
    }

    deleteFlight(req.query.username, req.query.flightId)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
})

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        return res.sendStatus(403)
    }
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.sendStatus(400)
    }
})
