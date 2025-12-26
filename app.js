require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', require('./routes/auth.route'));

async function main() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Successfuly connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`);
        });
    }catch(err){
        console.error(err.stack);
        process.exit(1)
    }
}

main();