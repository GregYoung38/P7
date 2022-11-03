const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,   // 60x60x1000 => 1 heure
    standardHeaders: true,
	legacyHeaders: false,
    message: "Quota de requêtes dépassé pour votre IP !"
});

module.exports = { limiter }