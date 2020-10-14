import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import NewCourse from './course/NewCourse'
//import Courses from './course/Courses'
import Course from './course/Course'
import EditCourse from './course/EditCourse'
import MyCourses from './course/MyCourses'
import Enrollment from './enrollment/Enrollment'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
  {/* In order to load the Course component in the frontend, we will add a route to
MainRouter  */}
{/* ---------------------------------------------------------------------------------------- */}
{/* This route URL (/course/:courseId) can now be added into any component to link
to a specific course, with the :courseId param replaced with the course's ID value */}
        <Route path="/course/:courseId" component={Course}/>
        <PrivateRoute path="/teach/courses" component={MyCourses}/>

   {/*/**The NewCourse component can only be viewed by a signed-in user who is also an
educator. So, we will add a PrivateRoute to the MainRouter component, which
will render this form only for authorized users at /teach/course/new. */ }
        <PrivateRoute path="/teach/course/new" component={NewCourse}/>
{/* In order to load EditCourse in the frontend of the application, we need to declare a
frontend route for it. This component can only be viewed by a signed-in user who is
also the instructor of the course. So, we will add a PrivateRoute in
the MainRouter component, which will render this view only for authorized users
at /teach/course/edit/:courseId */}
        <PrivateRoute path="/teach/course/edit/:courseId" component={EditCourse}/>
        <PrivateRoute path="/teach/course/:courseId" component={Course}/>
        <PrivateRoute path="/learn/:enrollmentId" component={Enrollment}/>

      </Switch>
    </div>)
}

export default MainRouter