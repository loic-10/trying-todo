const express = require('express')
const app = express()
require('./database')
const path = require('path')
const morgan = require('morgan')
const index = require('./routes')
const PORT = process.env.PORT || 4100
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')

exports.app = app

exports.server = app.listen(PORT, () => {
    console.log(`Trying todo, launch to http://localhost:${PORT}`)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('view engine', 'ejs')

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.disable('etag')

const options = {etag: false, dotfiles: 'allow', maxAge: '1d'}

app.use(morgan('short'))
app.use(express.static(path.join(__dirname, 'assets'), options))
app.use(express.static(path.join(__dirname, 'uploads'), options))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(index)

if ((process.env.NODE_ENV === 'development')) {
    app.use(errorHandler({log: errorNotification}))
} else {
    app.use((err, req, res, next) => {
        const response = err.response ? err.response.data : null
        const code = err.response ? err.response.status : 404
        console.log({response, code, err})
        res.render('errors', {code, response})
    });
}

function errorNotification(err, message, req) {
    let title = `Error in ${req.method} ${req.url}`
}

