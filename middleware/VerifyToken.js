import jwt from "jsonwebtoken"

export const verifyToken = async(req, res, next) => {
  console.log(req.headers['access-token'], '11')
  const authHeader = req.headers['access-token']

  // const token = authHeader && authHeader.split(' ')[1]
  const token = authHeader
  
  if(token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,  decoded) => {
    if(err) {
      console.log(err, 'error')
      return res.sendStatus(403)
    }
    req.email = decoded.email;
    next();
  })
}