import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import courseCtrl from '../controllers/course.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

// POST request to define a create enrollment API on the server,
/**he user who initiates the request from the client- side is identified from the user auth credentials sent in the request. */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**A POST request received at this route will first check whether the user is authenticated, and then check whether they are already enrolled on this
course, before creating a new enrollment for this user in this course. */
router.route('/api/enrollment/new/:courseId')
  .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)  

router.route('/api/enrollment/stats/:courseId')
  .get(enrollmentCtrl.enrollmentStats)

  /**complete API endpoint in the backend for enrollments, which will mark specified lessons as complete, and will also mark the enrolled course as
completed when all the lessons are done. */
router.route('/api/enrollment/complete/:enrollmentId')
/**we will first make sure that the signed-in user is the student who is associated with this enrollment record, and
then we will call the complete enrollment controller method */
  .put(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.complete) 

  //GET route that accepts the request which will return the enrollment details from the database
  /**A GET request at this route will first invoke the enrollmentByID method, since it
contains the enrollmentId param in the URL declaration. */
router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.remove)

  /**This route takes the course ID as a parameter in the URL. Hence, we also add the
courseByID controller method from the course controllers in order to process this
parameter and retrieve the corresponding course from the database. */
router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router
