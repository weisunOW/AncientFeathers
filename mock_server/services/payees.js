'use strict'
const fs = require('fs')
const colors = require('colors')
const util = require('util')
const http = require('http')
const bodyParser = require('body-parser')

function start(port, app) { 
    const payeesFilePath = '../data/payees/payees.json'

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    // GET, return a list of payee loaded from json file defined in payeesFilePath
    app.get('/payees', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        readJSONFile(payeesFilePath, (error, payees) => {
            if (error) {
                res.sendStatus(404).json({ "status": 404, "description": "Failed to load payees."})
                return
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(payees)
        })
    })

    // POST, overwrite the json file defined in payeesFilePath with the request body. (Note: Not validation)
    app.post('/payees', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        util.log(req.body)
        writeJSONToFile(req.body, payeesFilePath, (error) => {
            if (error) {
                res.status(500).json({ "status": 500, "description": "Failed to save payees."})
                return
            }

            res.status(200).json({"status": "success"})
        })
    })

    var server = http.createServer(app)
    return server
}

function readJSONFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (error, payeesJSONString) => {
        if (error) {
            util.log(colors.red(util.format("Failed to read %s", filePath)))
            return callback && callback(error)
        }
        try {
            let payees = JSON.parse(payeesJSONString)
            return callback && callback(null, payees)
        } catch(error) {
            util.log(colors.red(util.format("Error parsing %s with error %s", filePath, err)))
            return callback && callback(error)
        }
    })
}

function writeJSONToFile(json, filePath, callback) {
    let jsonString = JSON.stringify(json)
    fs.writeFile(filePath, jsonString, error => {
        return callback && callback(error)
    })
} 

exports.start = start