import Enrollment from '../models/enrollment.model'
import errorHandler from './../helpers/dbErrorHandler'

/**If a matching result is returned from the query, then the resulting enrollment will be
sent back in the response, otherwise, the create controller method will be invoked to
create a new enrollment. */
////////////////////////////////////////////////////////////////////////////////////////////////
/**The create controller method generates a new enrollment object to be saved into the
database from the course reference, user reference, and the lessons array in the given
course */
const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    student: req.auth,
  }
/**The lessons array in course is iterated over to generate the lessonStatus array of
objects for the new enrollment document. Each object in the lessonStatus array has
the complete value initialized to false. On successful saving of the new enrollment
document based on these values, the new document is sent back in the response. */
  newEnrollment.lessonStatus = req.course.lessons.map((lesson)=>{
    return {lesson: lesson, complete:false}
  })
  const enrollment = new Enrollment(newEnrollment)
  try {
    let result = await enrollment.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load enrollment and append to req.
 */
/**A GET request at this route will first invoke the enrollmentByID method, since it
contains the enrollmentId param in the URL declaration. The enrolmentByID
method will query the Enrollments collection by the provided ID, and if a matching
enrollment document is found, we ensure that the referenced course, the nested
course instructor, and the referenced student details are also populated using the
populate method from Mongoose. */
const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
                                    .populate({path: 'course', populate:{ path: 'instructor'}})
                                    .populate('student', '_id name')
    if (!enrollment)
      return res.status('400').json({
        error: "Enrollment not found"
      })
    req.enrollment = enrollment
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve enrollment"
    })
  }
}

const read = (req, res) => {
  return res.json(req.enrollment)
}

const complete = async (req, res) => {
  let updatedData = {}
  updatedData['lessonStatus.$.complete']= req.body.complete 
  updatedData.updated = Date.now()
  if(req.body.courseCompleted)
    updatedData.completed = req.body.courseCompleted

    try {
      let enrollment = await Enrollment.updateOne({'lessonStatus._id':req.body.lessonStatusId}, {'$set': updatedData})
      res.json(enrollment)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment
    let deletedEnrollment = await enrollment.remove()
    res.json(deletedEnrollment)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**The resulting enrollment object is attached to the request object and passed on to the
next controller method. Before returning this enrollment object in the response to the
client, we will check whether the currently signed-in user is the student who is
associated with this specific enrollment in the isStudent method */
////////////////////////////////////////////////////////////////////////////////////
/**The isStudent method checks whether the user who is identified by the auth
credentials that were sent in the request matches the student who is referenced in the
enrollment. */
const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth._id == req.enrollment.student._id
//If the two users don't match, a 403 status is returned with an error message, otherwise, the next controller method is invoked in order to return the enrollment object.
  if (!isStudent) {
    return res.status('403').json({
      error: "User is not enrolled"
    })
  }
  next()
//The next controller method is the read method,
}

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({student: req.auth._id}).sort({'completed': 1}).populate('course', '_id name category')
    res.json(enrollments)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
/**The findEnrollment controller method will query the Enrollments collection in
the database in order to check whether there is already an enrollment with the given
course ID and user ID */
const findEnrollment = async (req, res, next) => {
  try {
/**If a matching result is returned from the query, then the resulting enrollment will be
sent back in the response, otherwise, the create controller method will be invoked to
create a new enrollment. */
    let enrollments = await Enrollment.find({course:req.course._id, student: req.auth._id})
    if(enrollments.length == 0){
      next()
    }else{
      res.json(enrollments[0])
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const enrollmentStats = async (req, res) => {
  try {
    let stats = {}
    stats.totalEnrolled = await Enrollment.find({course:req.course._id}).countDocuments()
    stats.totalCompleted = await Enrollment.find({course:req.course._id}).exists('completed', true).countDocuments()
      res.json(stats)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
} 

export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isStudent,
  listEnrolled,
  findEnrollment,
  enrollmentStats
}
