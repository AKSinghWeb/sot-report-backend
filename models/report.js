const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportType: {
      type: String,
      enum: ['Faculty', 'HOD', 'Dean'],
      required: true,
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    publishedBy: {
      type: String,
    },
    departmentName: {
      type: String,
    },
  },
  { timestamps: true }
)
const Reports = mongoose.model('Reports', reportSchema)

module.exports = Reports
