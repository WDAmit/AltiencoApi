const config = require('./dbconfig');
const sql = require('mssql');

async function getUser() {
    try {
        let pool = await sql.connect(config.mssqlconfig);
        let products = await pool.request().query("select top 10 * from users");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUsersById(user_id) {
    try {
        let pool = await sql.connect(config.mssqlconfig);
        let details = await pool.request().input('user_id', sql.BigInt, user_id).query("select top 10 * from users where id=@user_id");
        return details.recordsets;
    }
    catch (error) { console.log(error) }
}

async function addUser(user)
{
    try{
        let pool = await sql.connect(config.mssqlconfig);
        let details = pool.request()
        .input('userName',user.userName)
        .input('userId',user.userId)
        .input('password',user.password)
        .input('mobile',user.mobile)
        .input('emailId',user.emailId)
        .input('roleId',user.roleId)
        .execute('addusers')
        return (await details).recordsets;
    }
    catch(error){ console.log(error);}
}


module.exports = {
    getUser: getUser,
    getUsersById: getUsersById,
    addUser: addUser
}