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
router.route('/api/courses/photo/:courseId')
  .get(courseCtrl.photo, courseCtrl.defaultPhoto)

router.route('/api/courses/defaultphoto')
  .get(courseCtrl.defaultPhoto)

router.route('/api/courses/:courseId/lesson/new')
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.newLesson)

router.route('/api/courses/:courseId')
  .get(courseCtrl.read)
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.update)
  .delete(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('userId', userCtrl.userByID)

export default router
