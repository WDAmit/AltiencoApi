class ApiResponse{
    constructor(Message, Message_Code, Result, Error)
    {
        this.Message = Message; 
        this.Message_Code = Message_Code;
        this.Result = Result; 
        this.Error = Error;
    }
}

module.exports = ApiResponse;