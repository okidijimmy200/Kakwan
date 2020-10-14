//create API, by passing the multipart form data,
//----------------------------------------------------------------
/**This method will be used in the new course form view to submit the user-entered
course details to the backend to create a new course in the database. */
const create = async (params, credentials, course) => {
    try {
        let response = await fetch('/api/courses/by/'+ params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: course
        })
          return response.json()
        } catch(err) { 
          console.log(err)
        }
  }
  
  const list = async (signal) => {
    try {
      let response = await fetch('/api/courses/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
/**use the fetch method to call the read course API in the React
component that will render the course details */
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, course) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: course
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  /**The fetch method will need to take the course ID and current user's
auth credentials, then call the delete API with these values. */
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
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
/**In order to use the list API in the frontend,we will define a fetch method that can be
used by the React components to load this list of courses. */
  const listByInstructor = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/courses/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
/**This listByInstructor method will take the userId value in order to generate the
API route to be called, and will receive the list of courses that were created by the
user associated with the provided userId value. */
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

  const newLesson = async (params, credentials, lesson) => {
    try {
      let response = await fetch('/api/courses/'+params.courseId+'/lesson/new', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({lesson:lesson})
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }
  const listPublished = async (signal) => {
    try {
      let response = await fetch('/api/courses/published', {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
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
    remove,
    listByInstructor,
    newLesson,
    listPublished
  }
