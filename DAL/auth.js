//#region 
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
//#endregion

//const posts = [ {username : 'anish', title : 's/w deverloper'}, {username : 'vishal', title : 'tester'}]

//app.use(express.json()); // now our application will use json from the body that gets passed inside the request

// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.json());


// app.get('/login', authenticateToken, (req,resp)=>{
//     console.log(req.user.name);
//     //return resp.json(posts);
//     return resp.json(posts.filter(post => post.username === req.user.name));
// });

// inside this function we need to get the token & this token is going to come from header
// so we are going to have a header called bearer 
function authenticateToken(req, resp, next) {
    const authheader = req.headers['authorization']
    const token = authheader && authheader.split(' ')[1];
    //console.log(authheader);
    
    if (token == null)
        return resp.status(401).json({error: err});
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userDecriptedDetails) => {
        if (err)
            return resp.status(403).json({error: err});

        req.userDetails = userDecriptedDetails;
        next();
    });
}

// app.post('/getJWTToken', (request, response) => {

//     const username = request.body.username;
//     const user = { name: username }

//     const accessToken = generateAccessToken(user); 
//     response.json({ accessToken: accessToken });
// });

function generateAccessToken(user)
{
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s' });
    return accessToken;
}



function getname (name, callback){
    console.log('within getname');
    setTimeout(()=>{
        console.log('set timeout');
        //return name
        callback(name)
        ,10000
    });   
   
}

function gethobby(name, callback){
    console.log('within gethobby');
    setTimeout(()=>{
        console.log('seet timeout');
        callback(['criket', 'reading','cancing']);
    },5000);
}
app.get('/test', (req, resp) => {

    console.log('start');

    let name = getname('sonam', (nm)=>{ console.log(nm)});
    console.log(name);
    gethobby(name, (hobby) =>{ console.log(hobby)});

    console.log('end');
    return resp.send('ok');
});


const port = process.env.port || 3000
app.listen(port);
console.log(`app is running at port ${port}`);


module.exports  = {
    generateAccessToken : generateAccessToken,
    authenticateToken : authenticateToken,
}