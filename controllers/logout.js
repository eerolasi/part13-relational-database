const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.delete('/', tokenExtractor, async (req, res) => {
  try {
    await Session.destroy({ where: { userId: req.decodedToken.id } })
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router
