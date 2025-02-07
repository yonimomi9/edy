
const errorHandler = (err, req, res, next) => {
    //maybe after i could delete the print in the console
    console.error(`Error occurred: ${err.message}`);
    res.status(500).json({ error: [err.message] });
};

module.exports = errorHandler;