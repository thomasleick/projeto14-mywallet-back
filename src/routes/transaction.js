const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')

router.post('/', (req, res) => res.sendStatus(400))
router.post('/:type', transactionController.postTransaction)
router.get('/', transactionController.getTransaction)

module.exports = router