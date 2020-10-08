import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {create} from './api-course.js'
import {Link, Redirect} from 'react-router-dom'
import { divide } from 'lodash'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))
export default function NewCourse() {
    const classes = useStyles()
/**first initialize the state by using the useState hook; with empty
input field values, an empty error message, and a redirect variable that is
initialized to false. */
    const [values, setValues] = useState({
        name: '',
        description: '',
        image: '',
        category: '',
        redirect: false,
        error: ''
    })
    const jwt = auth.isAuthenticated()
/**handler function in NewCourse so that we can track changes to these
fields in the form view */
//-------------------------------------------------------------------------
/**This handleChange function takes the new value that has been entered into the input
field and sets it to state, including the name of the file if one is uploaded by the user. */
    const handleChange = name => event => {
      const value = name === 'image'
        ? event.target.files[0]
        : event.target.value
      setValues({...values, [name]: value })
    }
/**This clickSubmit function will be called when the form is submitted. It first takes
the input values from the state and sets it to a FormData object. This ensures that the
data is stored in the correct format that is needed for the multipart/formdata
encoding type that is necessary for sending requests containing file uploads. */
///--------------------------------------------------------------------------------------
/**Then, the create fetch method is called to create a new course in the backend. */
    const clickSubmit = () => {
      let courseData = new FormData()
      values.name && courseData.append('name', values.name)
      values.description && courseData.append('description', values.description)
      values.image && courseData.append('image', values.image)
      values.category && courseData.append('category', values.category)
      create({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, courseData).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          setValues({...values, error: '', redirect: true})
        }
      })
    }
// either an error message is shown, or the user is redirected to the MyCourses view
      if (values.redirect) {
        return (<Redirect to={'/teach/courses'}/>)
      }
/**The form will contain an option to upload the course image, input fields for entering
the course Name, Description, and Category; and the SUBMIT button, which will
save the details that have been entered into the database. */
      return (<div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              New Course
            </Typography>
            <br/>
{/* In the form view, we first give the user an option to upload a course image file. */}
            <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
              <Button variant="contained" color="secondary" component="span">
                Upload Photo
                <FileUpload/>
              </Button>
            </label> <span className={classes.filename}>{values.image ? values.image.name : ''}</span><br/>
{/* Then, we add the name, description, and category form fields using the
TextField components from Material-UI. */}
            <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
            <TextField
              id="multiline-flexible"
              label="Description"
              multiline
              rows="2"
              value={values.description}
              onChange={handleChange('description')}
              className={classes.textField}
              margin="normal"
            /><br/> 
            <TextField id="category" label="Category" className={classes.textField} value={values.category} onChange={handleChange('category')} margin="normal"/><br/>
            {
              values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {values.error}</Typography>)
            }
          </CardContent>
          <CardActions>
{/* /**add the Submit button, which, when clicked, should call
a click-handling function */ }
            <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
            <Link to='/teach/courses' className={classes.submit}><Button variant="contained">Cancel</Button></Link>
          </CardActions>
        </Card>
      </div>)
  }

