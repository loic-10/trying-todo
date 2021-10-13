const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/trying_todo?readPreference=primary&appname=trying_todo&ssl=false', {
    useNewUrlParser: true
}).then(async () => {
    console.log('Connexion ok!')
}).catch(err => {
    console.log(err)
})


