import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import {create} from './api-enrollment'
import auth from './../auth/auth-helper'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500
    }
}))

/**The Enroll component will simply contain a button that initiates the enrollment call
to the backend, and redirects the user if the server returns successfully with the new
enrollment document's ID. This component takes the ID of the associated course as a
prop from the parent component from where it is added. This prop will be used while
making the create enrollment API call */

export default function Enroll(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    enrollmentId: '',
    error: '',
    redirect: false
  })
  const jwt = auth.isAuthenticated()
  /**When the ENROLL button is clicked, the create enrollment API will be fetched with
the provided course ID to either retrieve an existing enrollment, or to create a new
enrollment and receive it in the response. */
  const clickEnroll = () => {
    create({
      courseId: props.courseId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, enrollmentId: data._id, redirect: true})
      }
    })
  }
/**When the server sends back an enrollment successfully, the user will be redirected to
the view that will display the details of the specific enrollment. */
    if(values.redirect){
        return (<Redirect to={'/learn/'+values.enrollmentId}/>)
    }

  return (
      <Button variant="contained" color="secondary" onClick={clickEnroll}> Enroll </Button>
  )
}

/**Since the Enroll component receives the course ID as a prop from the parent
component, we also add PropType validation for
the component, as its functionality and implementation relies on this prop being
passed. */
Enroll.propTypes = {
  courseId: PropTypes.string.isRequired
}
