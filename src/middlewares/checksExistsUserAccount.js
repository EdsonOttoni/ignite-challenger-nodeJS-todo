function checksExistsUserAccount(users){
  return function (request, response, next) {
    const {username} = request.headers

    //procura se existe um usuário é igual
    const user = users.find(user => user.username === username)

    if(!user){
      response.status(404).json(
        {
          error: 'You do not have access'
        })
    }

    request.user = user

    return next()
  }
}

module.exports = {
  checksExistsUserAccount
}