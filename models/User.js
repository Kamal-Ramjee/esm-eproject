const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unqiue: true
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		default: 0
	},
	role: {
		type: String,
		enum:["organizers","exhibitors"],
		default:"attendees"
	}
})


module.exports = mongoose.model('user', userSchema)