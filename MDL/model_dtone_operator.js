class Operator {
    constructor(operatorID, operatorName, countryISOCode, countryName) {
        this.operatorID = operatorID;
        this.operatorName = operatorName;
        this.countryISOCode = countryISOCode;
        this.countryName = countryName;
    }
}

module.exports = {
    Operator: Operator
} 