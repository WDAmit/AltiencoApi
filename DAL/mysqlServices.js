
const mysql = require('mysql');
const config = require('./dbconfig');
var auth = require('./auth');
const mysqlConnection = mysql.createConnection(config.mysqlConfig);

mysqlConnection.connect((err) => {
    if (err) { console.log(`failed to connect mySql.`); }
    else { console.log(`my sql connected.`); }
});


async function logServiceError(exce) {
    let mySqlProc = 'call USP_Log_ServiceError(?,?,?)';
    await mysqlConnection.query(mySqlProc, [exce.moduleName, exce.functionName, exce.error]);
    //console.log(exce.moduleName, exce.functionName, exce.error);
}

//#region Login api
async function checkLogindetailsAsync(login) {
    const resp_checkLogindetailsAsync = await checkLogindetails(login);
    // const resp_checkLogindetailsAsync2 = await checkLogindetails2(resp_checkLogindetailsAsync);
    // console.log('fff');
    return resp_checkLogindetailsAsync;
}

function checkLogindetails(login) {
    let mySqlProc = 'call USP_CheckLoginDetails(@P,@Q,?,?,?,?,?,?,?); Select @P as isExistingUser, @Q as otp';

    return new Promise((resolve, reject) => {
        mysqlConnection.query(mySqlProc, [login.langCode, login.mobileCode, login.mobileNumber, login.deviceId, login.deviceType, login.deviceOSVersion, login.buildVersion], (err, rows) => {
            console.log(rows);
            let isExisting_user = rows[1][0].isExistingUser;

            if (!err) {
                resolve(rows[1][0]); //RowDataPacket
            }
            else { reject(err); }
        });
    });
}

//#endregion Login api

//#region verifyOTP api
async function verifyOTPAsync(verifyOtp) {
    const resp_apiTokenAsync = await apiToken(verifyOtp);
    const resp_verifyOTPAsync = await verifyOTP(verifyOtp, resp_apiTokenAsync);
    return resp_verifyOTPAsync;
}

function apiToken(verifyOtp) {
    let phone = { code: verifyOtp.mobileCode, mobile: verifyOtp.mobileNumber }

    return new Promise((resolve, reject) => {
        const accessToken = auth.generateAccessToken(phone); //jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        resolve(accessToken);
        reject(err);
    });
}

function verifyOTP(verifyOtp, apiToken) {
    let mySqlProc = 'call USP_VerifyOtp(?,?,?,?);';

    return new Promise((resolve, reject) => {
        mysqlConnection.query(mySqlProc, [verifyOtp.mobileCode, verifyOtp.mobileNumber, verifyOtp.otp, apiToken], (err, rows) => {
            if (!err) { resolve(rows[0][0]); }
            else { reject(err); }
        });
    });
}


//#endregion verifyOTP api


//#region Testing
async function checkLogindetailsCallback(login, callback) {
    try {
        let mySqlProc = 'CALL USP_CheckLoginDetails(@T,?,?); Select @T as isExisting_user';

        await mysqlConnection.query(mySqlProc, ['@T', login.mobileCode, login.mobileNumber], (err, rows, fields) => {
            let isExisting_user = rows[1][0].isExisting_user;
            console.log('isExisting_users :', isExisting_user);
            callback(rows);
        });
    }
    catch (err) { console.log('Error : ', err); }
}


async function logServiceError1(exce, login) {
    //async function logServiceError1(moduleName, functionName, error) {
    try {
        let mySqlProc = 'call USP_Log_ServiceError(?,?,?)';
        //await mysqlConnection.query(mySqlProc,  [moduleName, functionName, error]);
        await mysqlConnection.query(mySqlProc, [exce.moduleName, exce.functionName, exce.error]);
        //console.log(exce.moduleName, exce.functionName, exce.error);
        //console.log(login.id, login.name, login.password);
    }
    catch (err) { console.log(err); }
}

function checkLogindetails2(row) {
    try {
        return new Promise((resolve, reject) => {
            console.log('ee : ');
            resolve(row);
            reject(err);
        });
    }
    catch (err) {
        console.log(err)
    }
}


//DTone TEsting
function insertDtoneCountryCallback(Country, callback) {
    try {
        console.log(Country.countryName)
        let mySqlProc = 'CALL Insert_Country(?,?,?);';
        mysqlConnection.query(mySqlProc, [Country.countryName, Country.ISOCode, Country.region], (err, result) => {
            //console.log("result:", result);
            console.log("err:", err);
        });
    }
    catch (err) { console.log('Error : ', err); }
}

function getAllCountries(limit, callback) {
    try {
        let mySqlProc = 'CALL Select_Country(?);';
        mysqlConnection.query(mySqlProc, [limit], (error, results) => {
            if (error) {
                return console.error(error.message);
            }
            callback(results[0])
        })
    } catch (err) {
        console.log(err)
    }
}
function getCountriesByName(name, callback) {
    try {
        let mySqlProc = 'CALL SelectCountriesByName(?);';
        mysqlConnection.query(mySqlProc, [name], (error, results) => {
            if (error) {
                return console.error(error.message);
            }
            callback(results[0])
        })
    } catch (err) {
        console.log(err)
    }
}
function getOperators(callback) {
    try {
        let mySqlProc = 'call GetOperators();';
        mysqlConnection.query(mySqlProc, (error, results) => {
            if (error) {
                return console.error(error.message);
            }
            callback(results[0])
        })
    } catch (err) {
        console.log(err)
    }
}
function insertMultipleCountries(values) {
    try {
        console.log(values.countryName)
        let mySqlProc = 'call Insert_Country(?,?,?);';
        // mysqlConnection.query(mySqlProc, [values.countryName, values.isoCode, values.region], (error) => {
        //     if (error) {
        //         return console.error(error.message);
        //     }
        // })
    } catch (err) {
        console.log(err)
    }
}
async function InsertOperators(operator) {
    try {
        let mySqlProc = 'call Insert_Operators(?,?,?);';
        mysqlConnection.query(mySqlProc, [operator.countryISOCode, operator.operatorID, operator.operatorName], (error) => {
            if (error) {
                return console.error(error.message);
            }
        })
    } catch (err) {
        console.log(err)
    }
}
async function getOperatorsByIsoCode(value, callback) {
    try {
        let mySqlProc = 'call GetOperatorsByIsoCode(?);';
        mysqlConnection.query(mySqlProc, [value], (error, results) => {
            if (error) {
                return console.error(error.message);
            }
            callback(results)
        })
    } catch (err) {
        console.log(err)
    }
}
// function insertMultipleCountries(values) {
//     try {
//         //var sql = "INSERT INTO DTONE_Countries(Country_Name,ISO_Code,Rigon) VALUES ?";

//         console.log(values)
//         // mysqlConnection.query(sql, [values], function (err) {
//         //     console.log(err)
//         //     mysqlConnection.end();
//         // });
//     } catch (err) {
//         console.log(err)
//     }
// }





module.exports = {
    mysqlConnection: mysqlConnection,
    logServiceError: logServiceError,
    checkLogindetails: checkLogindetails,
    checkLogindetailsAsync: checkLogindetailsAsync,
    verifyOTPAsync: verifyOTPAsync,
    insertDtoneCountryCallback: insertDtoneCountryCallback,
    getAllCountries: getAllCountries,
    getCountriesByName: getCountriesByName,
    insertMultipleCountries: insertMultipleCountries,
    getOperators: getOperators,
    InsertOperators: InsertOperators,
    getOperatorsByIsoCode: getOperatorsByIsoCode
}


