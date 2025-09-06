const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info( 'Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).json({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.name, error.message)

    if(error.name === 'CastError'){
        return res.status(400).send({error:'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }else if(error.name === 'JsonWebTokenError'){
        return res.status(401).json({error:'invalid or missing token'})
    }else if(error.name === 'TokenExpiredError'){
        return res.status(401).json({error:'token expired'})
    }
    return res.status(500).json({error: 'Internal Server Error'})
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if(authorization?.startsWith('Bearer')){
        req.token = authorization.replace('Bearer', '')
    }

    next()
}
const userExtractor = async(req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(decodedToken?.id){
        req.user = await User.findById(decodedToken.id)
    }
    next()
}

module.exports = {requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor}

