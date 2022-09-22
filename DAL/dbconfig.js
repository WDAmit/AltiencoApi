const mssqlconfig = {
    user: "whidedba",
    password: "DB@123456",
    server: "whidedev.database.windows.net",
    database:"Whide-Dev1",
    'requestTimeout': 130000,
    options:{
        trustedconnection: true,
        enableArithAbort: true,
        instancename : "SQLEXPRESS",
    },
    port: 1433,
}

const mysqlConfig = {
    host: "dev-testdb.cluster-csqbwtufcqwt.eu-west-2.rds.amazonaws.com",
    user:"admin",
    password:"qwer1234!",
    database: "AltiencoDev",
    multipleStatements : true,
}

//module.exports = config;
module.exports ={
    mssqlconfig : mssqlconfig,
    mysqlConfig : mysqlConfig,
}