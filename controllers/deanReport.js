// route for dean report

const deanReportRouter = require('express').Router()
const Reports = require('../models/report')

deanReportRouter.get('/dean-report', async (req, res) => {
  try {
    const deanReport = await Reports.find({ reportType: 'Dean' }).populate(
      'user'
    )

    if (!deanReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    res.status(200).json(deanReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching dean report.' })
  }
})

deanReportRouter.get('/dean-report/:deanId', async (req, res) => {
  try {
    const { deanId } = req.params

    const deanReport = await Reports.findOne({ user: deanId }).populate('user')

    if (!deanReport) {
      return res.status(401).json({ error: 'Report not found' })
    }

    res.status(200).json(deanReport)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching dean report.' })
  }
})

deanReportRouter.post('/dean-report', async (req, res) => {
  try {
    const existingReport = await Reports.findOne({ user: req.body.user._id })

    if (existingReport) {
      existingReport.reportData = req.body.reportData

      await existingReport.save()
    } else {
      const report = new Reports({
        user: req.body.user,
        reportType: 'Dean',
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

deanReportRouter.get('/department-reports', async (req, res) => {
  try {
    const departments = [
      'Information Technology',
      'Electronics and Communication Engineering',
      'Energy Engineering',
      'Biomedical Engineering',
      'Basic Sciences and Social Sciences',
      'Nanotechnology',
      'Architecture',
    ]

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

    const mergedReports = await Promise.all(
      departments.map(async (departmentName) => {
        const hodReport = await Reports.findOne({
          reportType: 'HOD',
          departmentName,
        }).populate('user')

        const facultyReports = await Reports.find({
          reportType: 'Faculty',
          departmentName,
        }).populate('user')

        if (hodReport || facultyReports.length > 0) {
          const combinedArrays = hodReport
            ? { ...hodReport._doc.reportData }
            : {}

          facultyReports.forEach((report) => {
            const { reportData } = report

            arraysToMerge.forEach((key) => {
              if (reportData[key] instanceof Array) {
                combinedArrays[key] = combinedArrays[key] || []
                combinedArrays[key] = combinedArrays[key].concat(
                  reportData[key]
                )
              }
            })
          })

          const mergedReport = {
            departmentName,
            hodReportData: combinedArrays,
            facultyReports: facultyReports.map((facultyReport) => ({
              user: facultyReport.user,
              reportData: { ...facultyReport._doc.reportData },
            })),
          }

          return mergedReport
        }

        return null
      })
    )

    // Filter out null values (departments without reports)
    const validReports = mergedReports.filter((report) => report !== null)

    res.status(200).json(validReports)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching department reports.' })
  }
})



module.exports = deanReportRouter
