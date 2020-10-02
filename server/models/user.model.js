import mongoose from 'mongoose'
import crypto from 'crypto'

/**The mongoose.Schema() function takes a schema definition object as a parameter to
generate a new Mongoose schema object that will specify the properties or structure
of each document in a collection */
const Userschema = new mongoose.Schema({
    name: { //name field wch is a string and it will store user's name
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists', // email must be unique in the user collection.
        // value to be stored in this email field must have a valid email format
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
      /**The hashed_password and salt fields represent the encrypted user password that
we will use for authentication */
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String,
    updated: Date,
     /**These Date values will be programmatically generated to record timestamps that
indicate when a user is created and user data is updated */
    created: {
        type: Date,
        default: Date.now
    },
/**we will need an educator value that will be set to false by default in order to represent regular users, but that
can be set to true to represent the users who are also educators. */
    educator: {
        type: Boolean,
        default: false
    },
  
    
    /**NB:The actual password string is not stored directly in the database for security purposes
and is handled separately */
})

// Handling the password string as a virtual field
Userschema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })
    /**NB:
     * When the password value is received on user creation or update, it is encrypted into
a new hashed value and set to the hashed_password field, along with the
unique salt value in the salt field.
     */

     
//adding custom validation logic to the actual password string selected by the end user
Userschema.path('hashed_password').validate(function(v) {
    //ensuring tht the password for new user created or an existing user updated is atleast 6 characters
    if(this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be atleast 6 characters.')
    }
    if(this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

/**encryption logic and salt generation logic, which are used to generate the
hashed_password and salt values */

Userschema.methods = {
    /**authenticate: This method is called to verify sign-in attempts by
matching the user-provided password text with the hashed_password
stored in the database for a specific user. */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    /**encryptPassword: This method is used to generate an encrypted hash
from the plain-text password and a unique salt value using the crypto
module from Node. */
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err) {
            return ''
        }
    },
    /**makeSalt: This method generates a unique and random salt value using
the current timestamp at execution and Math.random(). */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}


export default mongoose.model("User", Userschema)

/**NB:The crypto module provides a range of cryptographic
functionality, including some standard cryptographic hashing
algorithms. In our code, we use the SHA1 hashing algorithm
and createHmac from crypto to generate the cryptographic
HMAC hash from the password text and salt pair. */