const express = require('express')
const cors = require('cors')
const http = require('http')
const colors = require('colors')
const util = require('util')

let port = 5000
let rest_service = express()

app.use(cors())

function start(port, app) {

    app.get('/payees', function(req, res) {
        res.status(200).json({ "status": "success" })
    })

    app.put('/payees', function(req, res) {
        res.sendStatus(200)
    })

    var server = http.createServer(app)
    return server
}

start(port, rest_service).listen(port, function() {
    console.log(colors.blue(util.format("REST Service started on port %d", port)))
});
