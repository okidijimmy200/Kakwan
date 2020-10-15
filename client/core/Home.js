import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import {listPublished} from './../course/api-course'
import {listEnrolled, listCompleted} from './../enrollment/api-enrollment'
import Typography from '@material-ui/core/Typography'
import auth from './../auth/auth-helper'
import Courses from './../course/Courses'
import Enrollments from '../enrollment/Enrollments'


const useStyles = makeStyles(theme => ({
  card: {
    width:'90%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: '#ffffff' 
  },
  extraTop: {
    marginTop: theme.spacing(12)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  enrolledTitle: {
    color:'#efefef',
    marginBottom: 5
  },
  action:{
    margin: '0 10px'
  },
  enrolledCard: {
    backgroundColor: '#616161',
  },
  divider: {
    marginBottom: 16,
    backgroundColor: 'rgb(157, 157, 157)'
  },
  noTitle: {
    color: 'lightgrey',
    marginBottom: 12,
    marginLeft: 8
  }
}))
/**For displaying the list of published courses, we will design a component that takes
the array of courses as props from the parent component that it is added to. */
export default function Home(){
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [courses, setCourses] = useState([])
  const [enrolled, setEnrolled] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({t: jwt.token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setEnrolled(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  /**In the Home component, we will retrieve the list of published courses from the
backend in a useEffect hook */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
/**Once the list of courses is received, it is set to the courses variable in the state. We
will pass this courses array to the Courses component as props when it is added to
the Home component, */
        setCourses(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
    return (<div className={classes.extraTop}>
      {auth.isAuthenticated().user && (
      <Card className={`${classes.card} ${classes.enrolledCard}`}>
        <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
            Courses you are enrolled in
        </Typography>
        {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>)
                             : (<Typography variant="body1" className={classes.noTitle}>No courses.</Typography>)
        }
      </Card>
      )}
      <Card className={classes.card}>
        <Typography variant="h5" component="h2">
            All Courses
        </Typography>
{/* Once the list of courses is received, it is set to the courses variable in the state. We
will pass this courses array to the Courses component as props when it is added to
the Home component, */}
        {(courses.length != 0 && courses.length != enrolled.length) ? (<Courses courses={courses} common={enrolled}/>) 
                             : (<Typography variant="body1" className={classes.noTitle}>No new courses.</Typography>)
        }
      </Card>
    </div>
    )
}

