const router = require('express').Router()

const e = require('express')
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })

  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ where: { username } })
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  user.name = req.body.name
  user.password = req.body.password
  await user.save()
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read === 'true') {
    where.read = true
  } else if (req.query.read === 'false') {
    where.read = false
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

module.exports = router
