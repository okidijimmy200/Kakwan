import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'

/**--errorHandler helper to respond to route
requests with meaningful messages when a Mongoose error occurs */
/**--lodash module is used when updating an existing user with changed values.  */

//When the Express app gets a POST request at '/api/users', it calls the create
// function we defined in the controller.
const create = async (req, res) => {
    /**new user with the user JSON object that's received in the POST
request from the frontend within req.body. */
    const user = new User(req.body)

    try {
        await user.save()
        return res.status(200).json({
            message: "successfully signed up"
        })
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**The list controller function finds all the users from the database, populates only the
name, email, created, and updated fields in the resulting user list, and then returns
this list of users as JSON objects in an array to the requesting client. */
const list = async(req, res) => {
    try{
        let users = await User.find().select('name email updated created')
        res.json(users)

    }
    catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if(!user)
            return res.status('400').json({
                error: "User not found"
            })
/**If a matching user is found in the database, the user object is appended to the request
object in the profile key */
        req.profile = user
        next()
    } catch(err) {
        return res.status('400').json({
            error: "Could not retireve user"
        })
    }
 }

/**The read function retrieves the user details from req.profile and removes
sensitive information, such as the hashed_password and salt values, before
sending the user object in the response to the requesting client */
const read = (req, res) => { 
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**The remove function retrieves the user from req.profile and uses the remove()
query to delete the user from the database */
const remove = async(req, res, next) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
 }

export default { create, userByID, read, list, remove, update}
