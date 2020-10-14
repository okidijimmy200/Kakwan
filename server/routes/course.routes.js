import express from 'express'
import courseCtrl from '../controllers/course.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/courses/published')
  .get(courseCtrl.listPublished)

/**POST route that verifies that the current user is an educator, and then creates a
new course with the course data passed in the request body */
router.route('/api/courses/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isEducator, courseCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, courseCtrl.listByInstructor)

/**The image file for the course, if uploaded by the user, is stored in MongoDB as data.
Then, in order to be shown in the views, it is retrieved from the database as an image
file at a separate GET API route */
// -------------------------------------------------------------
/**retrieve all the courses that have been created by a given user */
router.route('/api/courses/photo/:courseId')
  .get(courseCtrl.photo, courseCtrl.defaultPhoto)

router.route('/api/courses/defaultphoto')
  .get(courseCtrl.defaultPhoto)

/**backend API that will allow us to add and store new lessons
for a given course, we first need to declare a PUT route as follows: */
// --------------------------------------------------------------------
/**When this route gets a PUT request with the course ID in the URL, we will first use the
isInstructor method to check whether the current user is the instructor for the
course, and then we will save the lesson in the database with the newLesson method. */
router.route('/api/courses/:courseId/lesson/new')
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.newLesson)

  // implement a read course API using GET to query the Course collection with an ID and return the corresponding course in the response.
router.route('/api/courses/:courseId')
  .get(courseCtrl.read)
// declare the PUT route that accepts the update request  for updating course from the client
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.update)
  .delete(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.remove)

/**A PUT request that is received at the /api/courses/:courseId route first checks if
the signed-in user is the instructor of the course that is associated with the courseId
provided in the URL. If the user is found to be authorized, the update controller is
invoked */


// :courseId param in the route URL will call the courseByID controller method, wch retrieves the course from the database, and
// attaches it to the request object that is to be used in the next method,
router.param('courseId', courseCtrl.courseByID)
/**To process the :userId param in the route and retrieve the associated user from the
database, we will utilize the userByID method in our user controller */
// -------------------------------------------------------------
/**to maje user available in the request object as profile. */
router.param('userId', userCtrl.userByID)

export default router
