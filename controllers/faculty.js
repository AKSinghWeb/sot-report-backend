const facultyRouter = require('express').Router()

const User = require('../models/user')

facultyRouter.get('/department', async (req, res) => {
  const { userDepartment } = req.query

  try {
    // Query the database for users with the role Faculty and department as userDepartment
    const departmentFaculties = await User.find({
      role: 'Faculty',
      departmentName: userDepartment,
    })

    // Send the hodUsers as a response
    res.json({ users: departmentFaculties })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

module.exports = facultyRouter
