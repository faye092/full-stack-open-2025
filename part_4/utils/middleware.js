const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method, 'Path:', req.path, 'Body:', req.body)
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
    }
    return res.status(500).json({error: 'Internal Server Error'})
}

module.exports = {requestLogger, unknownEndpoint, errorHandler}

