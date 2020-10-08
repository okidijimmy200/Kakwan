import { signout } from './api-auth.js'

const auth = {

/////////////////////////////////////////////////////////////////
///isAuthenticated//////////////////////////////////////////////

  isAuthenticated() {
    if (typeof window == "undefined")
    //incase no credentails found in sessionStorage
      return false

      if (sessionStorage.getItem('jwt'))
    // Finding credentials in storage will mean a user is signed in,
        return JSON.parse(sessionStorage.getItem('jwt'))
      else
        return false
    },
/////////////////////////////////////////////////////////////////
//////////////authenticate user///////////////////////////////
/**In order to save the JWT credentials that are received from the server on successful
sign-in, we use the authenticate method */

  authenticate(jwt, cb) {
        /**The authenticate method takes the JWT credentials, jwt, and a callback
        function, cb, as arguments */
        
        if (typeof window !== "undefined")
        // It stores the credentials in sessionStorage after ensuring window is defined,
          sessionStorage.setItem('jwt', JSON.stringify(jwt))
        // --execute the callback function
        cb()
      },

    /**we will need to retrieve the stored credentials from sessionStorage to check if
the current user is signed in. */

////////////////////////////////////////////////////////////////
////////////////////Deleting credentials//////////////////////

/**When a user successfully signs out from the application, we want to clear the stored
JWT credentials from sessionStorage by using clearJWT */

  clearJWT(cb) {
    if (typeof window !== "undefined")
    // reoving JWT  credential from sessionStorage
      sessionStorage.removeItem('jwt')
    /** cb() function allows the component initiating the signout functionality to dictate what should happen after a
    successful sign-out. */
    cb()
/**The clearJWT method also uses the signout method we defined earlier in apiauth.
js to call the signout API in the backend */
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
    },
// Once the EditProfile view has been successfully updated, the user details that are stored in sessionStorage for auth purposes should also be updated
/**The
auth.updateUser method is called to do this sessionStorage update. */
        updateUser(user, cb) {
            if(typeof window !== "undefined"){
            if(sessionStorage.getItem('jwt')){
                let auth = JSON.parse(sessionStorage.getItem('jwt'))
                auth.user = user
                sessionStorage.setItem('jwt', JSON.stringify(auth))
                cb()
            }
            }
        }
}

export default auth
