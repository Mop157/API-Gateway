exports.errorHandler = (err, req, res, next) => {
    // console.error(err.stack);

    res.status(500).json({
        error: {
            message: err.message || 'Внутрішня помилка сервера',
            status: err.status || 500,
        }
    });
};

