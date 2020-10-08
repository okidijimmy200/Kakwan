import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(12)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  }
}))
/**This profile information can be fetched from the server if the user is signed in. To
verify this, the component has to provide the JWT credential to the read fetch call;
otherwise, the user should be redirected to the Sign In view. */

export default function Profile({ match }) {
  const classes = useStyles()
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  /**We also need to get access to the match props passed by the Route component,
which will contain a :userId parameter value. This can be accessed as
match.params.userId. */
  useEffect(() => {
/**This effect uses the match.params.userId value and calls the read user fetch
method. Since this method also requires credentials to authorize the signed-in user,
the JWT is retrieved from sessionStorage using the isAuthenticated method
from auth-helper.js, and passed in the call to read */
    const abortController = new AbortController()
    const signal = abortController.signal

/**Once the server responds, either the state is updated with the user information or the
view is redirected to the Sign In view if the current user is not authenticated */

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })
/**We also
add a cleanup function in this effect hook to abort the fetch signal when the
component unmounts. */
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
/**This effect only needs to rerun when the userId parameter changes in the route, for
example, when the app goes from one profile view to the other. To ensure this effect
reruns when the userId value updates, we will add [match.params.userId] in
the second argument to useEffect. */
// --------------------------------------------------------------------------------------------
//If the current user is not authenticated, we set up the conditional redirect to the Sign
//In view.

    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
//return the profile view if the  user currently signed in is viewing another user's profile
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Person/>
              </Avatar>
            </ListItemAvatar>
{/* Edit button and a
DeleteUser component, which will render conditionally based on whether the
current user is viewing their own profile. */}
            <ListItemText primary={user.name} secondary={user.email}/> {
/**In the Profile view, FollowProfileButton should only be shown when the user
views the profile of other users, */
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id &&
              (<ListItemSecondaryAction>
                <Link to={"/user/edit/" + user._id}>
                  <IconButton aria-label="Edit" color="primary">
            {/* The Edit button will route to the EditProfile component */}
                    <Edit/>
                  </IconButton>
                </Link>
    {/* custom DeleteUser component will handle the delete operation with the userId passed to
it as a prop. */}
                <DeleteUser userId={user._id}/>
              </ListItemSecondaryAction>)
            }
          </ListItem>
          <Divider/>
{/* to show the description text tht ws added to the about field on the User profile Page */}
          <ListItem>
            <ListItemText primary={"Joined: " + (
              new Date(user.created)).toDateString()}/>
          </ListItem>
        </List>
      </Paper>
    )
  }