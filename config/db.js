const { default: mongoose } = require("mongoose");

async function ConnectDB() {
	
	try {
		await mongoose.connect(process.env.DBURI || 'mongodb+srv://kamaldhera360_db_user:88jEKAguWleQ2GrC@esmdb.va39gxn.mongodb.net/ESMDB');
		console.log("Connected to DB....")
	} catch (error) {
		console.log("Failed to Connect -------------------> ", error.message)
	}
}

module.exports = ConnectDB