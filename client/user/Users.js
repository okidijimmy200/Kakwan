import React, {useState, useEffect} from 'react'
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
import ArrowForward from '@material-ui/icons/ArrowForward'
import Person from '@material-ui/icons/Person'
import {Link} from 'react-router-dom'
import {list} from './api-user.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
    marginTop: theme.spacing(12),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

export default function Users() { 
  const classes = useStyles()
/**We are using the built-in React hook, useState, to add state to this function
component. By calling this hook, we are essentially declaring a state variable
named users, which can be updated by invoking setUsers, and also set the initial
value of users to []. */

/**Using the built-in useState hook allows us to add state behavior to a function
component in React. Calling it will declare a state variable, similar to using
this.state in class component definitions. */
  const [users, setUsers] = useState([])

/**In our Users component, we use useEffect to call the list method from the apiuser.
js helper methods. This will fetch the user list from the backend and load the
user data into the component by updating the state. */

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })
/**In this effect, we also add a cleanup function to abort the fetch call when the
component unmounts. */
    return function cleanup(){
      abortController.abort()
    }
  /**In the second argument of this useEffect hook, we pass an empty array so that this
effect cleanup runs only once upon mounting and unmounting, and not after every
render. */
  }, [])
 /**Finally, in the return of the Users function component, we add the actual view
content */ 

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          All Users
        </Typography>
        <List dense>
{/* to generate each list item, we iterate through the array of users in the
state using the map function */}
         {users.map((item, i) => {
          return <Link to={"/user/" + item._id} key={i}>
                    <ListItem button>
{/* A list item is rendered with an individual user's name
from each item that's accessed per iteration on the users array. */}
                      <ListItemAvatar>
                        <Avatar>
                          <Person/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.name}/>
                      <ListItemSecondaryAction>
                      <IconButton>
                          <ArrowForward/>
                      </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                 </Link>
               })
             }
        </List>
      </Paper>
    )
}
