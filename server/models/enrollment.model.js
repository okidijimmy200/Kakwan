import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
/**Course reference: The course field will store the reference to the course
document with which this enrollment is associated: */
  course: {type: mongoose.Schema.ObjectId, ref: 'Course'},
/**Updated at: The updated field will be another Date value, which will be
updated every time a lesson is completed, indicating when was the last
time that the user worked on the course lessons: */
  updated: Date,
/**Enrolled at: The enrolled field will be a Date value indicating the time
that the enrollment was created; in other words, when the student enrolled
on the course: */
  enrolled: {
    type: Date,
    default: Date.now
  },
/**Student reference: The student field will store the reference to the user
who created this enrollment by choosing to enroll on a course: */
  student: {type: mongoose.Schema.ObjectId, ref: 'User'},
/**Lesson status: The lessonStatus field will store an array with references
to each lesson that is stored in the associated course in the lessons array.
For each object in this lessonStatus array, we will add a complete field
that will store a Boolean value that indicates whether the corresponding
lesson has been completed or not: */
  lessonStatus: [{
      lesson: {type: mongoose.Schema.ObjectId, ref: 'Lesson'}, 
      complete: Boolean}],

/**Completed at: The completed field will also be a Date type, which will
only be set when all the lessons in the course have been completed: */
  completed: Date
})

export default mongoose.model('Enrollment', EnrollmentSchema)
