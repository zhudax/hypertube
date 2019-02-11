const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.clearCookie('token');
    res.json({msg: "OK"});
});

module.exports = router;