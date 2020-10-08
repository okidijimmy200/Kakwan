import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {remove} from './api-user.js'
import {Redirect} from 'react-router-dom'

// when btn in the profile is clicked, it opens a dialog component asking user to confrim the delete action

/**This component initializes the state with open set to false for the Dialog
component, as well as redirect set to false so that it isn't rendered first. */
export default function DeleteUser(props) {
/**The DeleteUser component will also receive props from the parent component. In
this case, the props will contain the userId that was sent from the Profile
component. */
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()
/**Next, we need some handler methods to open and close the dialog button. The
dialog is opened when the user clicks the delete button. */
  const clickButton = () => {
    setOpen(true)
  }
/**The component will have access to the userId that's passed in as a prop from the
Profile component, which is needed to call the remove fetch method, along with
the JWT credentials, after the user confirms the delete action in the dialog. */
  const deleteAccount = () => { 

/**On confirmation, the deleteAccount function calls the remove fetch method with
the userId from props and JWT from isAuthenticated. */
    remove({
      userId: props.userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('deleted'))
/**On successful deletion, the
user will be signed out and redirected to the Home view. */
        setRedirect(true)
      }
    })
  }
// --when user clicks the cancel btn, dialog closes
  const handleRequestClose = () => {
    setOpen(false)
  }
    // we use the redirect component to redirect the current user to Home page
  if (redirect) {
    return <Redirect to='/'/>
  }
    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
//Validating props with PropTypes
//Since we are using the DeleteUser component in the Profile component, it gets
//added to the application view when Profile is added in MainRouter.
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}


