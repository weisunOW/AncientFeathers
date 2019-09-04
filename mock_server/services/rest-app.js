'use strict'
const path = require('path')
const fs = require('fs')
const colors = require('colors')
const util = require('util')
const http = require('http')
const bodyParser = require('body-parser')
const supportedContentType = [ 'application/json', 'application/vnd.mcp-anz.com+json;version=1.0' ]

function start(port, app) { 
    let dataFolder = 'data'
    let payeesFolder = 'payees'
    let consentFolder = 'consent'
    let payeesJSONFile = 'payees.json'
    let consentJSONFile = 'consent.json'
    let payeesFilePath = path.join(__dirname, '..', dataFolder, payeesFolder, payeesJSONFile)
    let consentFilePath = path.join(__dirname, '..', dataFolder, consentFolder, consentJSONFile)

    app.use(bodyParser.json({ type: (req) => supportedContentType.includes(req.get('Content-Type')) }))
    app.use(bodyParser.urlencoded({ extended: true }))
    
    // Consent GET
    app.get('/consent', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        res.setHeader('Content-Type', 'application/json')
        readJSONFile(consentFilePath, (error, consent) => {
            if (error) {
                res.status(404).json({ "status": 404, "description": "Failed to load consent."})
                return
            }
            let payload = Object.keys(consent).map((key) => { return consent[key] })
            res.status(200).json({ "Payload": payload })
        })
    })
    
    app.post('/consent', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        util.log(req.body)
        if (typeof req.body == undefined) {
            res.sendStatus(400)
            return
        }
        
        let id = req.body.id
        let status = req.body.consentStatus
        
        res.setHeader('Content-Type', 'application/json')
        readJSONFile(consentFilePath, (error, consent) => {
            if (error) {
                res.status(404).json({ "status": 404, "description": "Failed to load consent."})
                return
            }
            let bankConsent = consent[id]
            if (bankConsent) {
                bankConsent.consentStatus = status
                consent[id] = bankConsent
                writeJSONToFile(consent, consentFilePath, (error) => {
                    if (error) {
                        res.status(500).json({ "status": 500, "description": "Failed to update consent."})
                        return
                    }
                    
                    res.sendStatus(200)
                })
            } else {
                res.status(400).json({ "status": 404, "description": "Failed to load bank consent with id ${id}" })
            }
        })
    })
    
    // Payee GET, return a list of payee loaded from json file defined in payeesFilePath
    app.get('/payees', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        res.setHeader('Content-Type', 'application/json')
        readJSONFile(payeesFilePath, (error, payees) => {
            if (error) {
                res.status(404).json({ "status": 404, "description": "Failed to load payees."})
                return
            }
            res.status(200).json(payees)
        })
    })
    
    // Payee POST, overwrite the json file defined in payeesFilePath with the request body. (Note: Not validation)
    app.post('/payees', (req, res) => {
        util.log(util.format("Handling %s %s", req.method, req.url))
        util.log(req.body)
        res.setHeader('Content-Type', 'application/json')
        if (typeof req.body == undefined) {
            res.sendStatus(400)
            return
        }
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
            util.log(colors.red(util.format("Error parsing %s with error %s", filePath, error)))
            return callback && callback(error)
        }
    })
}

function writeJSONToFile(json, filePath, callback) {
    let jsonString = JSON.stringify(json, null, 4)
    fs.writeFile(filePath, jsonString, error => {
        return callback && callback(error)
    })
} 

exports.start = start
