/**The create method will take user data from the view component, which is where we
will invoke this method. Then, it will use fetch to make a POST call at the create API
route, '/api/users', to create a new user in the backend with the provided data */
const create = async (user) => {
    try {
        let response = await fetch('/api/users/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
      return await response.json()  //return the response from the server as a promise.
    } catch(err) {
      console.log(err)
    }
  }
  
//LIST METHOD?/////////////
/**The list method will use fetch to make a GET call to retrieve all the users in the
database, and then return the response from the server as a promise to the
component. */
  const list = async (signal) => {
    try {
      let response = await fetch('/api/users/', {
        method: 'GET',
        signal: signal,
      })
/**The returned promise, if it resolves successfully, will give the component an array
containing the user objects that were retrieved from the database */
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
/////////////////////////////////////////////////////////////
////////////////READ OPERATION//////////////////////////////

/**The read method will use fetch to make a GET call to retrieve a specific user by ID.
Since this is a protected route, besides passing the user ID as a parameter, the
requesting component must also provide valid credentials, which, in this case, will be
a valid JWT received after a successful sign-in. */
  const read = async (params, credentials, signal) => {
    try {
/**The JWT is attached to the GET fetch call in the Authorization header using the
Bearer scheme, and then the response from the server is returned to the component
in a promise. */
      let response = await fetch('/api/users/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
/**This promise, when it resolves, will either give the component the user
details for the specific user or notify that access is restricted to authenticated users. */
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
////////////////////////////////////////////////////////////////
///////////////UPDATE USER//////////////////////////////////

/**The update method will take changed user data from the view component for a
specific user, then use fetch to make a PUT call to update the existing user in the
backend. This is also a protected route that will require a valid JWT as the credential. */
  const update = async (params, credentials, user) => {
    try {
      let response = await fetch('/api/users/' + params.userId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(user)
/**Since the content type of the data that's sent to the server is no longer
'application/json', we also need to modify the update fetch method in apiuser.
js to remove Content-Type */
      })
/**this method will also return a promise
containing the server's response to the user update request */
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

///////////////////////////////////////////////////////////////////
//////////////DELETE USER/////////////////////////////////////

/**The remove method will allow the view component to delete a specific user from the
database and use fetch to make a DELETE call. This, again, is a protected route that
will require a valid JWT as a credential */

  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/users/' + params.userId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
/**The response from the server to the delete request will be returned to the component
as a promise */
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    read,
    update,
    remove
  }