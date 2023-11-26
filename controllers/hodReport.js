const hodReportRouter = require('express').Router()
const Reports = require('../models/report')

hodReportRouter.get('/hod-report', async (req, res) => {
  try {
    const hodReport = await Reports.find({ reportType: 'HOD' }).populate('user')

    if (!hodReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    res.status(200).json(hodReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching hod report.' })
  }
})

hodReportRouter.get('/hod-report/:hodId', async (req, res) => {
  try {
    const { hodId } = req.params

    const hodReport = await Reports.findOne({ user: hodId }).populate('user')

    if (!hodReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    res.status(200).json(hodReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching hod report.' })
  }
})

hodReportRouter.post('/hod-report', async (req, res) => {
  try {
    const existingReport = await Reports.findOne({ user: req.body.user._id })

    if (existingReport) {
      existingReport.reportData = req.body.reportData

      await existingReport.save()
    } else {
      const report = new Reports({
        user: req.body.user,
        reportType: 'HOD',
        reportData: req.body.reportData,
        publishedBy: req.body.user.name,
        departmentName: req.body.user.departmentName,
      })

      await report.save()
    }
    res.status(201).json({ message: 'Report saved successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
})

hodReportRouter.get('/department-report', async (req, res) => {
  try {
    const { departmentName } = req.query

    const departmentReport = await Reports.findOne({
      reportType: 'HOD',
      departmentName,
    }).populate('user')

    if (!departmentReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    const reports = await Reports.find({
      reportType: 'Faculty',
      departmentName,
    }).populate('user')

    const combinedArrays = {}

    // Define the arrays you want to merge from reportData
    const arraysToMerge = [
      'organizednational',
      'organizedinternational',
      'attendednational',
      'attendedinternational',
      'publicationsugcCareJournals',
      'publicationsbookswithISBN',
      'publicationseditedBooksVolumes',
      'publicationsbooksChapters',
      'seminarsConferences',
      'publicationspopularArticles',
      'policyReportnational',
      'policyReportinternational',
      'eContentDeveloped',
      'academicCollaborationsinternational',
      'academicCollaborationsnational',
      'consultancy',
    ]

    // Loop through each report and merge selected arrays from reportData
    reports.forEach((report) => {
      const { reportData } = report

      arraysToMerge.forEach((key) => {
        if (reportData[key] instanceof Array) {
          combinedArrays[key] = combinedArrays[key] || []
          combinedArrays[key] = combinedArrays[key].concat(reportData[key])
        }
      })
    })

    // Send the departmentReport and combinedArrays as a response
    const mergedReport = {
      ...departmentReport._doc,
      reportData: {
        ...departmentReport._doc.reportData,
        ...combinedArrays,
      },
    }
    res.status(200).json(mergedReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching department report.' })
  }
})

module.exports = hodReportRouter
