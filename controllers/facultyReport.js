const facultyReportRouter = require('express').Router()
const Reports = require('../models/report')

facultyReportRouter.get('/faculty-report/:facultyId', async (req, res) => {
  try {
    const { facultyId } = req.params

    const facultyReport = await Reports.findOne({ user: facultyId }).populate(
      'user'
    )

    if (!facultyReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    res.status(200).json(facultyReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching faculty report.' })
  }
})

facultyReportRouter.post('/faculty-report', async (req, res) => {
  try {
    const existingReport = await Reports.findOne({ user: req.body.user._id })

    if (existingReport) {
      existingReport.reportData = req.body.reportData

      await existingReport.save()
    } else {
      const report = new Reports({
        user: req.body.user,
        reportType: 'Faculty',
        reportData: req.body.reportData,
      })

      await report.save()
    }
    res.status(201).json({ message: 'Report saved successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
})

module.exports = facultyReportRouter
