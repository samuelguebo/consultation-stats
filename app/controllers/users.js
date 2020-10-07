const express = require('express')
const router = express.Router();

router.get('/users/:wiki/:pageId', function (req, res) {
    res.send(req.params)
})

module.exports = router