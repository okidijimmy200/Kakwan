/**The signin method will take user sign-in data from the view component, then use
fetch to make a POST call to verify the user with the backend */

const signin = async (user) => {
    try {
      let response = await fetch('/auth/signin/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
      })
  /**The response from the server will be returned to the component in a promise, which
  may provide the JWT if sign-in was successful. */
    return await response.json()
    } catch(err) {
      console.log(err)
  }
  /**NB:The component invoking this method
  needs to handle the response appropriately, such as storing the received JWT locally
  so it can be used when making calls to other protected API routes from the frontend. */
  }
  
  ////////////////////////////////////////////////////////////////////
  /////////////////////SIGN-OUT///////////////////////////////////////
  
  /**signout uses fetch to make a GET
  call to the signout API endpoint on the server */
  const signout = async () => {
    try {
      let response = await fetch('/auth/signout/', { method: 'GET' })
  /**This method will also return a promise to inform the component about whether the
  API request was successful. */       
    return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  // --export the signout and signin pages
  export {
    signin,
    signout
  }
 