const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


let jwtsecret = process.env.JWTSECRET || "MERN"
//----------/api/user/signup
//post
debugger;
router.post('/signup', async (req, res) => {
	let { name, email, password, role, age } = req.body
	let existinguser = await User.findOne({ email })
	if (existinguser) {
		res.json({
			message: "Account already exist with this email!"
		})
	} else {


		let hashpass = await bcrypt.hash(password, 10)

		try {
			let newuser = await User.create({ name, email, password: hashpass, role, age })
			res.json({
				message: "Signup Successful",
				newuser
			})
		} catch (error) {
			res.send(error.message)
		}
	}

})
//----------/api/user/login

router.post('/login', async (req, res) => {
	let { email, password } = req.body
	let existinguser = await User.findOne({ email })

	if (existinguser) {

		let isMatch = await bcrypt.compare(password, existinguser.password)
		if (isMatch) {

			let token = await jwt.sign({ _id: existinguser._id }, jwtsecret, { expiresIn: '3d' })


			res.json({
				message: "Signup Successful",
				user: existinguser,
				token
			})
		} else {
			res.json({
				message: "Incorrect Password"
			})
		}
	} else {
		res.json({
			message: "Account doesn't exist with this email! "
		})
	}


})
//.............Logout.............//
router.post('/logout', (req, res) => {
	res.clearCookie("token")
	res.clearCookie("user")
	res.json({ message: "Logout successful" })
})

//----------/api/user/getallusers
router.get('/all', async (req, res) => {

	try {
		let users = await User.find()
		res.json({
			message:"users get successfuly",
			users
		})

	} catch (error) {
		res.json({
			message: error.message
		})
	}

})

module.exports = router


//----------/api/user/getuserbyid
//get
router.get('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let user = await User.findById(id)

    if (user) {
      res.json({
        message: "user get successfuly",
        user
      })
    } else {
      res.json({
        message: "User not found"
      })
    }
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/user/updateuser
//put
router.put('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let { name, email, password, role, age } = req.body

    let user = await User.findById(id)
    if (!user) {
      return res.json({ message: "User not found" })
    }

    // if password comes, hash it
    if (password) {
      password = await bcrypt.hash(password, 10)
    }

    let updateduser = await User.findByIdAndUpdate(
      id,
      {
        name: name || user.name,
        email: email || user.email,
        password: password || user.password,
        role: role || user.role,
        age: age || user.age
      },
      { new: true }
    )

    res.json({
      message: "user update successfuly",
      updateduser
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/user/delete
//delete
router.delete('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let deleteduser = await User.findByIdAndDelete(id)

    if (deleteduser) {
      res.json({
        message: "user delete successfuly",
        deleteduser
      })
    } else {
      res.json({
        message: "User not found"
      })
    }
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})