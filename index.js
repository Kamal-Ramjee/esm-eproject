const express = require('express')
const ConnectDB = require('./config/db')
require('dotenv').config()


const app = express()
ConnectDB()

app.use(express.json())
app.use('/api/user/',require('./routes/userRoutes'))

// status
app.get('/', (req, res) => {
	res.send('maintenance')
})




const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(`server is running on port http://localhost:${port}`)
})