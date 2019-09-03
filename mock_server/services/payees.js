'use strict'
const fs = require('fs')
const colors = require('colors')
const util = require('util')

function start(port, app) { 
    const payeesFilePath = '../data/payees/payees.json'
    http = require('http')
    bodyParser = require('body-parser')
   
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    // GET
    app.get('/payees', (req, res) => {
        readJSONFile(payeesFilePath, (error, payees) => {
            if (error) {
                res.sendStatus(404)
                return
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(payees)
        })
    })

    // POST
    app.post('/payees', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({"status": "OK"})
    })

    var server = http.createServer(app)
    return server
}

function readJSONFile(filePath, callback) {
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (error, payeesJSONString) => {
            if (error) {
                console.error(colors.red(util.format("Failed to read %s", filePath)))
                return callback && callback(error)
            }
            try {
                let payees = JSON.parse(payeesJSONString)
                return callback && callback(null, payees)
            } catch(error) {
                console.error(colors.red(util.format("Error parsing %s with error %s", filePath, err)))
                return callback && callback(error)
            }
        })
    }
}

exports.start = start