const router = require('express').Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middlewares')
router.post('/', async (req, res) => {
  try {
    const readingList = await ReadingList.create(req.body)
    res.json(readingList)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const readingList = await ReadingList.findByPk(req.params.id)
    if (user.id !== readingList.userId) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router
