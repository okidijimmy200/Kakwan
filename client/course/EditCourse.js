import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import ArrowUp from '@material-ui/icons/ArrowUpward'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-course.js'
import {Link, Redirect} from 'react-router-dom'
import auth from './../auth/auth-helper'
import Divider from '@material-ui/core/Divider'

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
  upArrow: {
      border: '2px solid #f57c00',
      marginLeft: 3,
      marginTop: 10,
      padding:4
 },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 250,
    display: 'inline-block',
    width: '50%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  textfield:{
    width: 350
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  list: {
    backgroundColor: '#f3f3f3'
  }
}))

export default function EditCourse ({match}) {
  const classes = useStyles()
  const [course, setCourse] = useState({
      name: '',
      description: '',
      image:'',
      category:'',
      instructor:{},
      lessons: []
    })
  const [values, setValues] = useState({
      redirect: false,
      error: ''
    })
  /**EditCourse. This component will first load the course details by calling the read fetch method in the
useEffect hook */
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
/**After successfully receiving the course data in the response, it will be set to the
course variable in the state by calling setCourse, and it will be used to populate the
view. */ 
      read({courseId: match.params.courseId}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          data.image = ''
          setCourse(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  const jwt = auth.isAuthenticated()
/**The changes to the input fields will be handled in order to capture the newly entered
values with the handleChange method */
  const handleChange = name => event => {
    const value = name === 'image'
    ? event.target.files[0]
    : event.target.value
    setCourse({ ...course, [name]: value })
  }
/**In order to handle the changes made to the values in each field with the Textfield, we will define a
handleLessonChange method, which will take the field name and the corresponding lesson's index in the array */
  const handleLessonChange = (name, index) => event => {
    const lessons = course.lessons
/**The lessons array in the course is updated in the state, after setting the value in the
specified field of the lesson at the provided index. This updated course with the
modified lesson will get saved to the database when the user clicks Save in the
EditCourse view. */
    lessons[index][name] =  event.target.value
    setCourse({ ...course, lessons: lessons })
  }
  // When the Delete button is clicked, we will take the index of the lesson that is being deleted and remove it from the lessons array.
  // -----------------------------------------------------------------------------------------------------------------------------------
  /**In this function, we are splicing the array to remove the lesson from the given index, then adding the updated array in the course in the state. This new lesson array will be
sent to the database with the course object when the user clicks the Save button in the EditCourse page */
  const deleteLesson = index => event => {
    const lessons = course.lessons
    lessons.splice(index, 1)
    setCourse({...course, lessons:lessons})
 }
 /**When the user clicks the arrowUp button, the lesson in the current index will be moved up,
and the lesson above it will be moved to its place in the array */
// -----------------------------------------------------------------------------------------
//The rearranged lessons array is then updated in the state, and will be saved to the database when the user saves the changes in the EditCourse page.
  const moveUp = index => event => {
      const lessons = course.lessons
      const moveUp = lessons[index]
      lessons[index] = lessons[index-1]
      lessons[index-1] = moveUp
      setCourse({ ...course, lessons: lessons })
  }
  /**When the Save button is clicked, we will get all the course details and set it to
FormData, which will be sent in the multipart format to the backend using the course
update API */
  const clickSubmit = () => {
    let courseData = new FormData()
    course.name && courseData.append('name', course.name)
    course.description && courseData.append('description', course.description)
    course.image && courseData.append('image', course.image)
    course.category && courseData.append('category', course.category)
/**The course lessons are also sent in this FormData, but as lessons are stored as an
array of nested objects and FormData only accepts simple key-value pairs, we
stringify the lessons value before assigning it. */
    courseData.append('lessons', JSON.stringify(course.lessons))
    update({
        courseId: match.params.courseId
      }, {
        t: jwt.token
      }, courseData).then((data) => {
        if (data && data.error) {
            console.log(data.error)
          setValues({...values, error: data.error})
        } else {
          setValues({...values, redirect: true})
        }
      })
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/course/'+course._id}/>)
  }
    const imageUrl = course._id
          ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
          : '/api/courses/defaultphoto'
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={<TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={course.name} onChange={handleChange('name')}
                  />}
                  subheader={<div>
                        <Link to={"/user/"+course.instructor._id} className={classes.sub}>By {course.instructor.name}</Link>
                        {<TextField
                    margin="dense"
                    label="Category"
                    type="text"
                    fullWidth
                    value={course.category} onChange={handleChange('category')}
                  />}
                      </div>
                    }
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id &&
                (<span className={classes.action}><Button variant="contained" color="secondary" onClick={clickSubmit}>Save</Button>
                    </span>)
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={course.name}
                  />
                  <div className={classes.details}>
                  <TextField
                    margin="dense"
                    multiline
                    rows="5"
                    label="Description"
                    type="text"
                    className={classes.textfield}
                    value={course.description} onChange={handleChange('description')}
                  /><br/><br/>
                  <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
                 <label htmlFor="icon-button-file">
                    <Button variant="outlined" color="secondary" component="span">
                    Change Photo
                    <FileUpload/>
                    </Button>
                </label> <span className={classes.filename}>{course.image ? course.image.name : ''}</span><br/>
                  </div>
                

          </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Lessons - Edit and Rearrange</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{course.lessons && course.lessons.length} lessons</Typography>}
                />
                <List>
                {course.lessons && course.lessons.map((lesson, index) => {
                    return(<span key={index}>
                    <ListItem className={classes.list}>
                    <ListItemAvatar>
                        <>
                        <Avatar>
                        {index+1}
                        </Avatar>
{/* While updating lessons, the user will also be able to reorder each lesson on the list.There will be an up arrow button for each lesson, except for the very first lesson. This
button will be added to each lesson item in the view */}
                     { index != 0 &&     
                      <IconButton aria-label="up" color="primary" onClick={moveUp(index)} className={classes.upArrow}>
{/* When the user clicks this button, the lesson in the current index will be moved up,
and the lesson above it will be moved to its place in the array */}
                        <ArrowUp />
                      </IconButton>
                     }
                    </>
                    </ListItemAvatar>
                    <ListItemText
/**each item in the list of lessons will contain three TextFields for each of the fields in a lesson and will be prepopulated with the
existing values of the fields */
                        primary={<><TextField
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            value={lesson.title} onChange={handleLessonChange('title', index)}
                          /><br/>
                          <TextField
                          margin="dense"
                          multiline
                          rows="5"
                          label="Content"
                          type="text"
                          fullWidth
                          value={lesson.content} onChange={handleLessonChange('content', index)}
                        /><br/>
                        <TextField
            margin="dense"
            label="Resource link"
            type="text"
            fullWidth
            value={lesson.resource_url} onChange={handleLessonChange('resource_url', index)}
          /><br/></>}
                    />
{/* page, each item rendered in the lessons list will have a delete option. The Delete button will be added in the view to each list item */}
                    {!course.published && <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="up" color="primary" onClick={deleteLesson(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>}
                    </ListItem>
                    <Divider style={{backgroundColor:'rgb(106, 106, 106)'}} component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
        </div>)
}
