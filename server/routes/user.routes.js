import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
    .get(userCtrl.list) //Listing users with GET
    .post(userCtrl.create) //Creating a new user with POST

// user route declarations that need to be protected with authentication and authorization.
router.route('/api/users/:userId')
// --route to read user's information requires only authentication verification
    .get(authCtrl.requireSignin, userCtrl.read) //Fetching a user with GET
    // --route for update and delete requires both authentication and authorization
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update) //Updating a user with PUT
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove) //Deleting a user with DELETE

router.param('userId', userCtrl.userByID)

export default router

