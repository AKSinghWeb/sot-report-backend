const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/faculty', async (req, res) => {
  try {
    // Query the database for users with the role "hod"
    const hodUsers = await User.find({ role: 'Faculty' })

    // Send the hodUsers as a response
    res.json({ users: hodUsers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

userRouter.get('/hod', async (req, res) => {
  try {
    // Query the database for users with the role "hod"
    const hodUsers = await User.find({ role: 'HOD' })

    // Send the hodUsers as a response
    res.json({ users: hodUsers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

userRouter.post('/', async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      departmentName,
      dateJoining,
      designation,
    } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.json({ error: 'Username already exists' })
    }

    if (req.body.role === 'HOD') {
      const hodInDepartment = await User.findOne({
        departmentName: req.body.departmentName,
        role: 'HOD',
      })
      if (hodInDepartment) {
        return res.json({ error: 'HOD already exists for this department.' })
      }
    }

    const newUser = new User({
      username,
      name,
      email,
      password,
      role,
      departmentName,
      dateJoining,
      designation,
    })

    const savedUser = await newUser.save()

    res.status(201).json({ message: 'User Created Successfully', savedUser })
  } catch (error) {
    res.status(400).json({ message: 'User registration failed' })
  }
})

userRouter.delete('/:userId', async (req, res) => {
  const { userId } = req.params // Assuming the user ID is passed as a route parameter

  try {
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = userRouter
