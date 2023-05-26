function errorhandler({ err, message, channel, fatal }) {
    console.error(err, message);
}

module.exports = { errorhandler };
