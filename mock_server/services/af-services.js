const express = require('express')
const cors = require('cors')
const colors = require('colors')
const util = require('util')
const restApp = require('./rest-app')

let port = 5000

app = express()
app.use(cors())
restApp.start(port, app).listen(port, () => {
    util.log(colors.cyan(util.format("Payees Services started on port %d", port)))
})
