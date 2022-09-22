//#region import files from project
var mssqlServices = require('./DAL/mssqlServices');
var mysqlServices = require('./DAL/mysqlServices');
var auth = require('./DAL/auth');

var airtimeApi = require('./AIRTIMEAPI/airtimeApi');
//var mdl_user = require('./MDL/model_user');
const { Exception, Login } = require('./MDL/model_exception');
const { userLogin, VerifyOTP } = require('./MDL/model_user');
const { Country } = require('./MDL/model_dtone_countries')
const { Operator } = require('./MDL/model_dtone_operator');
//#endregion 

//#region import libraries from package.json
var bodyparser = require("body-parser");
var cors = require("cors");
var express = require("express"); //import to this one to use api 

var app = express();
var router = express.Router();
//#endregion 

//#region register middleware

/* app.use is a way to register middleware or multiple middlewares before executing any end route logic or intermediary route logic depending upon order of middleware registration sequence.*/
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors()); // api is running one domain and cliet is calling from another source
app.use('/api', router); // eg. http://abc.com/api

/* this will be get executed before any other route execution, you can apply authentication/authorization here.. */
router.use((request, response, next) => {
    console.log("called api: " + request.path);
    next();
});
//#endregion

//#region MYSql Operations

//#region GET: api/GetSupplierList
/*  Details : Send Login details & get in return JWT Token for further operations
    Created By: Anish Dubey || 25/july/22
    Updated By: Anish Dubey || 26/july/22 */
router.route('/GetSupplierList').get(async (req, resp) => {
    let moduleName = 'Supplier';
    let functionName = 'GET: api/GetSupplierList';
    let error = '';
    const exce = new Exception(moduleName, functionName, error);
    //const login = new Login(123,'anish','12345');
    try {
        //let mySqlProc = `call USP_GetSupplierList`;   
        //await mysqlServices.mysqlConnection.query(mySqlProc, (err, rows, fields) => {    

        let mySqlProc = 'call USP_Log_ServiceError(?,?,?)';
        await mysqlServices.mysqlConnection.query(mySqlProc, [exce.moduleName, exce.functionName, exce.error], (err, rows, fields) => {
            if (!err) {
                //response.send(rows);
                return resp.status(200).json({ Message: 'Success', Message_Code: 1, Result: { Department: rows[0], Job: rows[1], } });
            }
            else {
                //mysqlServices.logServiceError(Module_Name, Function_Name, err.message);
                exce.error = err.message;
                mysqlServices.logServiceError(exce);
                return resp.status(403).json({ Message: 'Failed', Message_Code: 0, Error: err });
            }
        });
    }
    catch (err) {
        exce.error = err.message;
        mysqlServices.logServiceError(exce);
        return resp.status(401).json({ Message: 'Failed', Message_Code: 0, Error: err });
    }
    //finally { mysqlServices.mysqlConnection.end(); }
});

router.route('/userlogin').post(async (request, response) => {
    let moduleName = 'Supplier';
    let functionName = 'POST: api/login';
    const exce = new Exception(moduleName, functionName, '');
    try {
        let langCode = request.body.langCode;
        let mobileCode = request.body.mobileCode;
        let mobileNumber = request.body.mobileNumber;
        let deviceId = request.body.deviceId;
        let deviceType = request.body.deviceType;
        let deviceOSVersion = request.body.deviceOSVersion;
        let buildVersion = request.body.buildVersion;

        const login = new userLogin(langCode, mobileCode, mobileNumber, deviceId, deviceType, deviceOSVersion, buildVersion);

        //#region using callback

        // mysqlServices.checkLogindetailsCallback(login, (resp_checkLogindetails)=>{
        //     //console.log('resp_checkLogindetails : ', resp_checkLogindetails);
        //     return response.status(200).json({ Message: 'Success', Message_Code: 1, Result: resp_checkLogindetails });
        // });   

        //#endregion using callback

        //#region using async await

        const rows = await mysqlServices.checkLogindetailsAsync(login)
        return response.status(200).json({ Message: 'Success', Message_Code: 1, Result: rows });

        //#endregion using async await
    }
    catch (err) {
        exce.error = err.message;
        mysqlServices.logServiceError(exce);
        return response.status(401).json({ Message: 'Failed', Message_Code: 0, Error: err });
    }
});


router.route('/verifyOTP').post(async (request, response) => {
    let moduleName = 'Supplier';
    let functionName = 'POST: api/login';
    const exce = new Exception(moduleName, functionName, '');
    try {
        let mobileCode = request.body.mobileCode;
        let mobileNumber = request.body.mobileNumber;
        let otp = request.body.otp;

        const verifyOtp = new VerifyOTP(mobileCode, mobileNumber, otp);
        const rows = await mysqlServices.verifyOTPAsync(verifyOtp)
        return response.status(200).json({ Message: 'Success', Message_Code: 1, Result: rows });

    }
    catch (err) {
        exce.error = err.message;
        mysqlServices.logServiceError(exce);
        return response.status(401).json({ Message: 'Failed', Message_Code: 0, Error: err });
    }
});

//#endregion


//#endregion

//#region MSSql Operations

//#region GET: api/login
/*  Details : Send Login details & get in return JWT Token for further operations
    Created By: Anish Dubey || 25/july/22
    Updated BY: Anish Dubey || 26/july/22 */
router.route('/login').post((request, response) => {
    try {
        let username = request.body.username;
        let password = request.body.password;
        let user = { name: username, password: password }
        //console.log(user); // <== { name: 'vishal', password: '12345' }
        const accessToken = auth.generateAccessToken(user); //jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        response.status(200).json({ accessToken: accessToken });
    }
    catch (err) {
        return resp.status(401).json(err);
    }
});
//#endregion


//#region GET: api/userDetails
/*  Details : Send JWT token to get authenticated user details in response
    Created By: Anish Dubey || 25/july/22
    Updated By: Anish Dubey || 26/july/22 */
//app.get('/userDetails', auth.authenticateToken, (req, resp) => {
router.route('/userDetails').get(auth.authenticateToken, (req, resp) => {
    try {
        //console.log(req.userDetails); // <== { name: 'vishal', password: '12345', iat: 1658468425, exp: 1658468545 }
        const posts = [{ username: 'anish', title: 's/w deverloper' }, { username: 'vishal', title: 'tester' }]
        let arrUser = posts.filter(post => post.username === req.userDetails.name);
        //return resp.json(posts);

        return resp.status(200).json(arrUser[0]);
    }
    catch (err) {
        console.log(err);
        return resp.status(401).json({ error: err });
    }
});
//#endregion

router.route('/users').get((request, response) => {
    try {
        mssqlServices.getUser().then(result => {
            return response.json(result[0]);
        })
    }
    catch (error) { console.log(error); }
});

router.route('/users/:user_id').get((reqeust, response) => {
    try {
        console.log(`request id: ${reqeust.params.user_id}`);
        mssqlServices.getUsersById(reqeust.params.user_id).then((result) => {
            return response.json(result[0]);
        });
    }
    catch (error) { console.log(error); }
});

router.route('/users').post((request, response) => {
    try {
        console.log({ ...request.body });
        let user = { ...request.body };
        mssqlServices.addUser(user).then((result) => {
            return response.status(201).json(result);
        })
    }
    catch (error) { console.log(error); }
});



//Dtone

router.route('/countries').post(async (request, response) => {
    let moduleName = 'Supplier';
    let functionName = 'POST: api/login';
    const exce = new Exception(moduleName, functionName, '');
    try {
        let countryName = request.body.countryName;
        let ISOCode = request.body.ISOCode;
        let region = request.body.region;

        //response.send({countryName:countryName,ISOCode:ISOCode,region:region})
        const country = new Country(countryName, ISOCode, region);
        mysqlServices.insertDtoneCountryCallback(country, () => {

        })
        response.status(200).json({ Message: 'Success', Message_Code: 1 });
    }
    catch (err) {
        exce.error = err.message;
        mysqlServices.logServiceError(exce);
        return response.status(401).json({ Message: 'Failed', Message_Code: 0, Error: err });
    }
});
// router.route('/getCountries').get( async (request, response) => {
//     let moduleName = 'Supplier';
//     let functionName = 'POST: api/login';
//     const exce = new Exception(moduleName, functionName, '');
//     try {
//          mysqlServices.getAllCountries((result)=>{
//               console.log("reuslte>>"+result)
//          })
//          response.status(200).json({ Message: 'Success', Message_Code: 1 });
//     }
//     catch (err) {
//         exce.error = err.message;
//         mysqlServices.logServiceError(exce);
//         return response.status(401).json({ Message: 'Failed', Message_Code: 0, Error: err });
//      }
// });


router.route('/insertMultipleCountries').post(async (request, response) => {
    let jsonArray = JSON.parse(JSON.stringify(request.body))
    for (let i = 0; i < jsonArray.length; i++) {
        const country = new Country(jsonArray[i].countryName, jsonArray[i].ISOCode, jsonArray[i].region);
        mysqlServices.insertMultipleCountries(country)
    }
})
router.route('/InsertOperators').get(async () => {
    let operators = await airtimeApi.operators()
    try {
        for await (let data of operators) {
            let jsonArray = JSON.parse(JSON.stringify(data.data))
            for (let i = 0; i < jsonArray.length; i++) {
                //console.log(jsonArray[i].country.name + '--' + jsonArray[i].country.isoCode)
                const operator = new Operator(jsonArray[i].id, jsonArray[i].name, jsonArray[i].country.isoCode, jsonArray[i].country.name);
                mysqlServices.InsertOperators(operator)
            }
        }
    } catch (err) {
        console.log(err.message)
    }
})

router.route('/getTPCountries').get(async (request, response) => {
    let limit = request.query.count
    console.log(limit)
    mysqlServices.getAllCountries(limit, (row) => {
        console.log(JSON.stringify(row))
        response.send(JSON.parse(JSON.stringify(row)))
    })
})
router.route('/getGCCountries').get(async (request, response) => {
    let limit = request.query.count
    console.log(limit)
    mysqlServices.getAllCountries(limit, (row) => {
        console.log(JSON.stringify(row))
        response.send(JSON.parse(JSON.stringify(row)))
    })
})
router.route('/getCountriesByName').get(async (request, response) => {
    let name = request.query.name
    console.log(name + '%')
    mysqlServices.getCountriesByName(name + '%', (row) => {
        console.log(JSON.stringify(row))
        response.send(JSON.parse(JSON.stringify(row)))
    })
})


router.route('/operators').get(async (request, response) => {
    mysqlServices.getOperators((row) => {
        console.log(JSON.stringify(row))
        response.send(JSON.parse(JSON.stringify(row)))
    })
})
router.route('/GetOperatorByIsoCode').get(async (request, response) => {
    try {
        mysqlServices.getOperatorsByIsoCode('IND', (result) => {
            //console.log((JSON.stringify(result[0])))
            response.send(result[0])
        })
    } catch (err) {

    }
})
router.route('/products').get(async (request, response) => {
    var params = request.body
    console.log(params)
    let con = await airtimeApi.products(params)
    console.log(await con)
    var result = [];
    var result1 = [];
    try {

        for await (let data of con) {
            result1.push(data.data)
            result.push(JSON.stringify(data.data))
        }
        response.contentType('application/json');
        response.send(JSON.stringify(result).replace(/\\/g, ''));
        console.log(result1)
    } catch (err) {
        response.send(err.message)
    }
});
// router.route('/insertMultipleCountries').post(async (request, response) => {

//     let jsonArray = JSON.parse(JSON.stringify(request.body))
//     var arr = []
//     for (let i = 0; i < jsonArray.length; i++) {
//         var arr2 = []

//         arr2.push(jsonArray[i].countryName)
//         arr2.push(jsonArray[i].ISOCode)
//         arr2.push(jsonArray[i].region)

//         arr.push(arr2)
//     }
//     console.log(arr)
//     mysqlServices.insertMultipleCountries(arr)
// })

//#endregion

//#region set the port no. to run the application
const port = process.env.port || 8090;
app.listen(port);
console.log(`app is running at port: ${port}`);
//#endregion
