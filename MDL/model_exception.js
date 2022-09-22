class Exception {
    constructor(moduleName, functionName, error) {
      this.moduleName = moduleName;
      this.functionName = functionName;
      this.error = error;
    }  
  }

class Login {
    constructor(id, name, password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }
    displayUserInfo() {
        return `User details : ${this.id} ${this.name} ${this.password}`;
    }
} 

 module.exports ={
    Exception : Exception,
    Login : Login,
 } 