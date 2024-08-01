const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DB_URL;
      
async function main() {
    try {
        await mongoose.connect(uri).then(()=>{
            console.log('Connected to MongoDB')
        });
    
    } catch (e) {
        console.error('Error connecting to MongoDB', e);
    }
    finally {
        //wait mongoose.connection.close();
    }
}

main();

module.exports = {main, mongoose};