/* eslint-disable no-underscore-dangle */
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const SECRET_KEY = 'KEY'
loginRouter.post('/', async (req, res) => {
  const { username, password, role } = req.body

  try {
    // Check if the user with the given email exists
    const user = await User.findOne({ username })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials. User not found' })
    }

    // Verify the password
    const isPasswordValid = password === user.password

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if the user's role matches the required role (e.g., 'HOD' in this case)
    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Invalid role.' })
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: '1h',
    })

    res.status(200).json({ message: 'Login successful', token, user })
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message })
  }
})

module.exports = loginRouter
