import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String
})
const Lesson = mongoose.model('Lesson', LessonSchema)
/**name and description fields will have string types, with name as a required field: */
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
/**The image field will store the course image file to be uploaded by the user as binary data in the MongoDB database: */
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
/**The category field will store the category value of the course as a string, and it will be a required field: */
  category: {
    type: String,
    required: 'Category is required'
  },
/**The created and updated fields will be Date types, with created generated when a new course is added,
and updated changed when any course details are modified */
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
/**The instructor field will reference the user who created the course: */
  instructor: {type: mongoose.Schema.ObjectId, ref: 'User'},
/**The published field will be a Boolean value, indicating whether the course is published or not: */
  published: {
    type: Boolean,
    default: false
  },
  lessons: [LessonSchema]
})

export default mongoose.model('Course', CourseSchema)
