const user = require('../models/user.js');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

exports.register = async (request, reply) => {
  try {
    const { name, email, password, country } = request.body;

    
    if (!name || !email || !password || !country) {
      return reply.code(400).send({ message: "All fields are required!" });
    }


    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    //  Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      country
    });

    await user.save();

    reply.code(201).send({ message: "User registered successfully!" });

  } catch (err) {
    console.error("Register Error:", err);
    reply.code(500).send({ message: "Server error. Please try again later." });
  }
};


exports.login = async(request,reply) => {
    try {

        //validate body 

        const {email,password} = request.body;
        const user = await User.findOne({email})

        if(!user){
            return reply.code(400).send({message: "Invalid "})
        }

        //validate the password

        const isValid = await bcrypt.compare(password , user.password)

        if(!isValid){
            return reply.code(400).send({message: "Invalid email or passaword"})
        }

        const token  = request.server.jwt.sign({id: user._id})
        reply.send({token});

        
    } catch (err) {
        reply.send(err);
        
    }
};


exports.forgotPassword = async(request, reply) => {
    try {
       const {email} =  request.body
       const user = await User.findOne({email})
       if(!user){
            return reply.notFound("User not found")
       }

      const resetToken =  crypto.randomBytes(32).toString('hex')
      const resetPasswordExpire = Date.now() + 10 * 60  * 1000;

      user.resetPasswordToken = resetToken
      user.resetPasswordExpiry = resetPasswordExpire

      await user.save({validateBeforeSave: false});

      const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`
      
      reply.send({resetUrl})

    } catch (error) {
        reply.send(error)
        
    }
}

exports.resetPassword = async(request,reply) => {
    const resetToken = request.params.token    // API fetch ke time pe ye chij automatic daal dega url me

    const{newPassword} = request.body      // ye to front end ki req se aaaya hai

    const user = User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetPasswordExpire
    })

    if(!user){
        return reply.notFound("User not found")
    }

   // hash the password
   const hashedPassword = bcrypt.hash(newPassword,12)

   user.password = hashedPassword
   user.resetPasswordToken= undefined
   user.resetPasswordExpiry = undefined

   await user.save();

   reply.send({message : "Password reset Sent Successfully !!"})
}


exports.logout = async(request , reply) => {
    // JWT  are stateless use strategies like refreshToken or blacklist token for more
    reply.send({message:"User loggeed out."})
}
