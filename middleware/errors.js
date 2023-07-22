const catchAsync =
  handler =>
  (...args) => {
        handler(...args).catch(args[2])
  }


const sendError = async(err, req, res, next) => {
    res.status(err.statusCode ? err.statusCode : 500).json({
        status: err.status ? err.status : 'Internal server error',
        message: err.message ? err.message : 'Internal server error',
        success: err.success || false
      })
}

module.exports = {
    catchAsync,
    sendError
}