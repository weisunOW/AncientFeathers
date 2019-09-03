const express = require('express')
const cors = require('cors')
const colors = require('colors')
const util = require('util')
const payeesServices = require('./payees')

let port = 5000

payeesApp = express()
payeesApp.use(cors())
payeesServices.start(port, payeesApp).listen(port, () => {
    console.log(colors.cyan(util.format("Payees Service started on port %d", port)))
})
