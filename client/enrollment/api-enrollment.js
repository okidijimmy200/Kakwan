//temp code
const create = async (params, credentials) => {
    try {
        let response = await fetch('/api/enrollment/new/'+params.courseId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          }
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
 // call the fetch API for courses enrolled starting with the completed ones 
  const listEnrolled = async (credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/enrolled', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
//fetch method on the client that will make the GET request to this route.
  const enrollmentStats = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/stats/'+params.courseId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
/**To use this complete API endpoint in the frontend, you also need to define a corresponding fetch method like we did for other API implementations. This fetch
method should make a PUT request to the complete enrollment route with related values sent in the request. */
  const complete = async (params, credentials, enrollment) => {
    try {
      let response = await fetch('/api/enrollment/complete/' + params.enrollmentId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(enrollment)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    read,
    complete,
    remove,
    listEnrolled,
    enrollmentStats
  }