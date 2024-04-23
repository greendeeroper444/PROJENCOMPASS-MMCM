const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const middleware = express();

middleware.use(express.json());
middleware.use(express.urlencoded({
    extended: false
}));
middleware.use(cookieParser());

middleware.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

module.exports = middleware