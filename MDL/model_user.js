class Login {
    constructor(langCode, mobileCode, mobileNumber, deviceId, deviceType, deviceOSVersion, buildVersion ) {
        this.langCode =     langCode;
        this.mobileCode =   mobileCode;  
        this.mobileNumber = mobileNumber;
        this.deviceId =     deviceId; 
        this.deviceType =   deviceType;
        this.deviceOSVersion = deviceOSVersion;  
        this.buildVersion = buildVersion;
    }
} 

class VerifyOTP {
    constructor(mobileCode, mobileNumber, otp) {
        this.mobileCode =   mobileCode;  
        this.mobileNumber = mobileNumber;
        this.otp = otp;
    }
} 

module.exports ={
    userLogin : Login,
    VerifyOTP: VerifyOTP,
 } 