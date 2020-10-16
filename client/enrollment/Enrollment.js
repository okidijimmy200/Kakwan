import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import {read, complete} from './api-enrollment.js'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Info from '@material-ui/icons/Info'
import CheckCircle from '@material-ui/icons/CheckCircle'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { CardContent } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        marginTop: theme.spacing(12),
        marginLeft: 250
      }),
      heading: {
        marginBottom: theme.spacing(3),
        fontWeight: 200
      },
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 20px'
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
  avatar: {
    color: '#9b9b9b',
    border: '1px solid #bdbdbd',
    background: 'none'
  },
  media: {
    height: 180,
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
    margin: '8px 24px',
    display: 'inline-block'
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: '#616161'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
      backgroundColor: '#e9e3df'
  },
  unselected: {
      backgroundColor: '#ffffff'
  },
  check: {
      color:'#38cc38'
  },
  subhead: {
      fontSize: '1.2em'
  },
  progress: {
      textAlign: 'center',
      color: '#dfdfdf',
      '& span':{
        color: '#fffde7',
        fontSize: '1.15em'
      }
    },
  para: {
    whiteSpace: 'pre-wrap'
  }
}))

export default function Enrollment ({match}) {
  const classes = useStyles()
  const [enrollment, setEnrollment] = useState({course:{instructor:[]}, lessonStatus: []})
  const [values, setValues] = useState({
      error: '',
      drawer: -1
    })
  const [totalComplete, setTotalComplete] = useState(0)
    const jwt = auth.isAuthenticated()
/**To implement this view, first, we need to make a fetch call to the read enrollment API
in the useEffect hook in order to retrieve the details of the enrollment and set it to
state */
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({enrollmentId: match.params.enrollmentId}, {t: jwt.token}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          totalCompleted(data.lessonStatus)
          setEnrollment(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.enrollmentId])
  const totalCompleted = (lessons) => {
/**The total number of completed lessons is calculated using the totalCompleted function, */
//////////////////////////////////////////////////////////////////////////////////////////////
/**We use the array reduce function to find and tally the count for the completed lessons in the lessonStatus array. This count value is also stored in the state, so that
it can be rendered in the view at the bottom of the drawer, */
    let count = lessons.reduce((total, lessonStatus) => {return total + (lessonStatus.complete ? 1 : 0)}, 0)
/**The student's lessons will have a check icon next to them, as an indication of which lessons are either complete or incomplete. We also give the student a number tally of
how many were completed out of the total. The course is considered completed when all the lessons are done */
    setTotalComplete(count)
    return count
  }
  /**To determine which drawer is currently selected, we will utilize the initialized drawer value to state with a -1. The -1 value will be associated with the Course
Overview drawer item and view, whereas the index of each lessonStatus item will determine which lesson is displayed when selected from the drawer. When a drawer
item is clicked, we will call the selectDrawer method, giving it either -1 or the index of the lesson clicked as its argument */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**This selectDrawer method sets the drawer value in the state according to the item clicked on the drawer. The actual content view will also render conditionally,
depending on this drawer value, */
  const selectDrawer = (index) => event => {
      setValues({...values, drawer:index})
  }
  /**markComplete function, which will make the API call to update the enrollment in the
database */
  const markComplete = () => {
      if(!enrollment.lessonStatus[values.drawer].complete){
        const lessonStatus = enrollment.lessonStatus
        lessonStatus[values.drawer].complete = true
        let count = totalCompleted(lessonStatus)
/**we prepare the values to be sent with the request in the updatedData object. We send the lessonStatus
details, including the ID value and complete value set to true for the lesson that was completed by the user. We also calculate if the total number of completed lessons
is equal to the total number of lessons, so that we can set and send the courseCompleted value in the request, */
        let updatedData = {}
        updatedData.lessonStatusId = lessonStatus[values.drawer]._id
        updatedData.complete = true

        if(count == lessonStatus.length){
            updatedData.courseCompleted = Date.now()
        }

      complete({
        enrollmentId: match.params.enrollmentId
      }, {
        t: jwt.token
      }, updatedData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          setEnrollment({...enrollment, lessonStatus: lessonStatus})
        }
      })
    }
  }
    const imageUrl = enrollment.course._id
          ? `/api/courses/photo/${enrollment.course._id}?${new Date().getTime()}`
          : '/api/courses/defaultphoto'
/**We will implement the drawer layout using Material-UI's Drawer component. In the
drawer, we keep the first item as the Course Overview, which will give the user an
overview of the course details, similar to the single course page */
    return (
        <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      ><div className={classes.toolbar} />
      <List>
      <ListItem button onClick={selectDrawer(-1)} className={values.drawer == -1 ? classes.selectedDrawer : classes.unselected}>
            <ListItemIcon><Info /></ListItemIcon>
            <ListItemText primary={"Course Overview"} />
      </ListItem>
      </List>
      <Divider />
      <List className={classes.unselected}>
      <ListSubheader component="div" className={classes.subhead}>
          Lessons
        </ListSubheader>
        {enrollment.lessonStatus.map((lesson, index) => (
          <ListItem button key={index} onClick={selectDrawer(index)} className={values.drawer == index ? classes.selectedDrawer : classes.unselected}>
            <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                        {index+1}
                        </Avatar>
            </ListItemAvatar>
            <ListItemText primary={enrollment.course.lessons[index].title} />
            <ListItemSecondaryAction>
                    { lesson.complete ? <CheckCircle className={classes.check}/> : <RadioButtonUncheckedIcon />}
                    </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
          <ListItem>
        <ListItemText primary={<div className={classes.progress}><span>{totalComplete}</span> out of <span>{enrollment.lessonStatus.length}</span> completed</div>} />
          </ListItem>
      </List>
      {/* after adding this first drawer item, we create a separate section
for the lessons, where the lessonStatus array is iterated over to list the lesson titles
in the drawer. */}
    </Drawer>
{/* The course overview section can be designed and implemented according to the
Course page In order to render the individual lesson details,we use card */}
              {values.drawer == - 1 && 
              <Card className={classes.card}>
                <CardHeader
                  title={enrollment.course.name}
                  subheader={<div>
                        <Link to={"/user/"+enrollment.course.instructor._id} className={classes.sub}>By {enrollment.course.instructor.name}</Link>
                        <span className={classes.category}>{enrollment.course.category}</span>
                      </div>
                    }
                  action={
                    totalComplete == enrollment.lessonStatus.length &&
                (<span className={classes.action}>
{/* Each of the items in the Lessons section of the drawer will also give the user a visual
indication of whether the lesson has been completed, or is still incomplete. These
check or uncheck icons will be rendered based on the Boolean value of the complete
field in each item in the lessonStatus array. */}
                  <Button variant="contained" color="secondary">
                    <CheckCircle /> &nbsp; Completed
                  </Button>
                </span>)
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={enrollment.course.name}
                  />
                  <div className={classes.details}>
                    <Typography variant="body1" className={classes.subheading}>
                        {enrollment.course.description}<br/>
                    </Typography>
                  </div>
                </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Lessons</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{enrollment.course.lessons && enrollment.course.lessons.length} lessons</Typography>}
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == enrollment.course.instructor._id &&
                (<span className={classes.action}>
                  
                </span>)
            }
                />
                <List>
                {enrollment.course.lessons && enrollment.course.lessons.map((lesson, i) => {
                    return(<span key={i}>
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                        {i+1}
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
            </Card> }
{/* This will render the details of the lesson that has been selected, which are the title,
content, and resource URL values */}
             {values.drawer != -1 && (<>
             <Typography variant="h5" className={classes.heading}>{enrollment.course.name}</Typography>
             <Card className={classes.card}>
                <CardHeader
/**In the Enrollment component, in which we are rendering each lesson's details in the drawer view, we will give the student the option to mark the lesson as completed.
This option will render conditionally, depending on whether the given lesson is
already completed or not. */
                  title={enrollment.course.lessons[values.drawer].title}
/**If the given lessonStatus object has the complete attribute set to true, then we render a filled-out button with the text Completed, otherwise an outlined button is
rendered with the text Mark as complete */
                  action={<Button onClick={markComplete} variant={enrollment.lessonStatus[values.drawer].complete? 'contained' : 'outlined'} color="secondary">{enrollment.lessonStatus[values.drawer].complete? "Completed" : "Mark as complete"}</Button>} />
                  <CardContent> 
                      <Typography variant="body1" className={classes.para}>{enrollment.course.lessons[values.drawer].content}</Typography>
                  </CardContent>
                  <CardActions>
                    <a href={enrollment.course.lessons[values.drawer].resource_url}><Button variant="contained" color="primary">Resource Link</Button></a>
                </CardActions>
                </Card></>)}
        </div>)
}