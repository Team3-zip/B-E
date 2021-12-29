const express = require('express');

const router = express.Router();

const mainRouter = require('./main');
const detailRouter = require('./detail');

router.use('/main', mainRouter);
router.use('/', detailRouter);



module.exports = router;