require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const axios = require('axios')
const startBot = require('./bot')


const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Сервер запушен на ${PORT} порту`));

        startBot();

        app.get('/', (req, res) => {
            res.send('Server is running!')
        })

        setInterval(() => {
            axios.get('https://wangabletech-bek.onrender.com')
                .then(() => console.log('Pinged server'))
                .catch(err => console.error(err));
        }, 5 * 60 * 1000);
    } catch (err) {
        console.log(err);
    }
}

start()