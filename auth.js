const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

var client = jwksClient({
  jwksUri: process.env.AUTH_DOMAIN
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};
 
function verifyUser(request, errOrUserCallback){
  try{
    const token = request.header.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, getKey, {}, errOrUserCallback);
  }catch(error){
    errOrUserCallback('Not Authorized');
  }
}

module.export = verifyUser;