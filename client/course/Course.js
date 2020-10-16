import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import PeopleIcon from '@material-ui/icons/Group'
import CompletedIcon from '@material-ui/icons/VerifiedUser'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-course.js'
import {enrollmentStats} from './../enrollment/api-enrollment'
import {Link, Redirect} from 'react-router-dom'
import auth from './../auth/auth-helper'
import DeleteCourse from './DeleteCourse'
import Divider from '@material-ui/core/Divider'
import NewLesson from './NewLesson'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Enroll from './../enrollment/Enroll'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
      }),
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 190,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  category:{
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5
  },
  action: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  statSpan: {
    margin: '7px 10px 0 10px',
    alignItems: 'center',
    color: '#616161',
    display: 'inline-flex',
    '& svg': {
      marginRight: 10,
      color: '#b6ab9a'
    }
  },
  enroll:{
    float: 'right'
  }
}))

export default function Course ({match}) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [course, setCourse] = useState({instructor:{}})
  const [values, setValues] = useState({
      redirect: false,
      error: ''
    })
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()
/**we will first retrieve the
course details with a fetch call to the read API in a useEffect hook and then we will
set the received values to state, */
// ------------------------------------------------------------------------------------------
/**useEffect will only run when courseId changes in the route params. */
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({courseId: match.params.courseId}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          setCourse(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
/**To retrieve these enrollment stats, we will add a second useEffect hook in the
Course component in order to make a fetch call to the enrollment stats API, */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    enrollmentStats({courseId: match.params.courseId}, {t:jwt.token}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setStats(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  const removeCourse = (course) => {
    setValues({...values, redirect:true})
  }
  const addLesson = (course) => {
      /**addLesson update function,which was passed as a prop, is executed to render the latest lessons in the Course
component. */
    setCourse(course)
  }
  // When the PUBLISH button is clicked, we will open a dialog asking the user for confirmation.
  const clickPublish = () => {
  /**clickPublish function will only open the dialog box if the length of the lessons
array is more than zero; preventing the instructor from publishing a course without
any lessons. */
    if(course.lessons.length > 0){    
      setOpen(true)
    }
  }
  /**When the PUBLISH button on the dialog is clicked by the user as confirmation to
publish the course, we will make an update API call to the backend, with the
published attribute of the course set to true. */
//////////////////////////////////////////////////////////////
/**In this function, we are using the same update API that has already been defined and
used for saving modifications to other course details from the EditCourse view. */
  const publish = () => {
    let courseData = new FormData()
      courseData.append('published', true)
      update({
          courseId: match.params.courseId
        }, {
          t: jwt.token
        }, courseData).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error})
          } else {
            setCourse({...course, published: true})
            setOpen(false)
          }
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/courses'}/>)
  }
/**imageUrl consists of the route that will retrieve the course image as a file response */
    const imageUrl = course._id
          ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
          : '/api/courses/defaultphoto'
/**In the view, we will render the received details, such as course name, description,
category, image, and a link to the instructor's user profile in a Material-UI Card
component, */
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={course.name}
                  subheader={<div>
                        <Link to={"/user/"+course.instructor._id} className={classes.sub}>By {course.instructor.name}</Link>
                        <span className={classes.category}>{course.category}</span>
                      </div>
                    }
                  action={<>
{/* When the course instructor is signed in and views the course page, we will render the
edit and other course data-modifying options in the Course component. */}
{/* ------------------------------------------------------------------------- */}
{/* If the current user is signed in, and their ID matches with the course instructor's ID,
only then will the Edit option be rendered. */}
             {auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id &&
                (<span className={classes.action}>
                  <Link to={"/teach/course/edit/" + course._id}>
                    <IconButton aria-label="Edit" color="secondary">
                      <Edit/>
                    </IconButton>
                  </Link>
{/* The states of this button will primarily depend on whether the published attribute
of the course document is set to true or false, and on the length of the lessons
array. */}
                {!course.published ? (<>
                  <Button color="secondary" variant="outlined" onClick={clickPublish}>{course.lessons.length == 0 ? "Add atleast 1 lesson to publish" : "Publish"}</Button>
    {/* user ID, the DeleteCourse component will take the course ID and the
onRemove function definition from the Course component as props, when it is added
to Course, */}
{/* --------------------------------------------------------------------------------------- */}
{/* The delete option will only be rendered if the course is not already published. */}
                  <DeleteCourse course={course} onRemove={removeCourse}/>
                </>) : (
                  <Button color="primary" variant="outlined">Published</Button>
                )}
                </span>)
             }
{/* This will receive the enrollment stats for the given course and set it to the stats
variable in state, and we can render it in the view */}
                {course.published && (<div>
                  <span className={classes.statSpan}><PeopleIcon /> {stats.totalEnrolled} enrolled </span>
                  <span className={classes.statSpan}><CompletedIcon/> {stats.totalCompleted} completed </span>
                  </div>
                  )}
                
                </>
            }
                />
                <div className={classes.flex}>
              {/* imageUrl consists of the route that will retrieve the course image as a file response */}
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={course.name}
                  />
                  <div className={classes.details}>
                    <Typography variant="body1" className={classes.subheading}>
                        {course.description}<br/>
                    </Typography>
                    
              {course.published && <div className={classes.enroll}><Enroll courseId={course._id}/></div>} 
                    
                    
                  </div>
                </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Lessons</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{course.lessons && course.lessons.length} lessons</Typography>}
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id && !course.published &&
                (<span className={classes.action}>
                  <NewLesson courseId={course._id} addLesson={addLesson}/>
                </span>)
            }
                />
{/* The lessons for a specific course will be rendered in a list—along with a tally of the
total number of lessons—on the Course page below the other course */}
{/* ------------------------------------------------------------------------------------ */}
{/* To render this list of lessons, we will update the Course component to iterate over
the array of lessons with a map function, and each lesson will be displayed in a
Material-UI ListItem component, */}
                <List>
                {course.lessons && course.lessons.map((lesson, index) => {
                    return(<span key={index}>
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
{/* The number beside each list item is calculated using the current index value of the
array. */}
                        {index+1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={lesson.title}
                    />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
{/* When the instructor clicks on the PUBLISH button, they will see a dialog box
informing them of the consequences of this action, and giving them the options to
PUBLISH the course or CANCEL the action. */}
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">Publishing your course will make it live to students for enrollment. </Typography><Typography variant="body1">Make sure all lessons are added and ready for publishing.</Typography></DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                  Cancel
                </Button>
                <Button onClick={publish} color="secondary" variant="contained">
                  Publish
                </Button>
              </DialogActions>
             </Dialog>   
        </div>)
}
