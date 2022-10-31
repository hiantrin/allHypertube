const jwt =  require('jsonwebtoken')

const createToken = (username, type) => {
    const JWT_SECRET = ["ajingoolikanawene7kilik7kaaaya!!", "okontiliyaokhlitektiiiirinarianri77ha!!", "yahabibiya7abibituestombecomme!!"]
    const token = jwt.sign({user: username}, JWT_SECRET[type])
    return token;
}



module.exports = createToken;