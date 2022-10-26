function findUserById(users) {
  return function (request, response, next) {
    const id = request.params.id

    const user = users.find(user => user.id === id)

    if(!user){
      response.status(404).json(
        {
          error: 'User not exist'
        })
    }

    request.user = user

    return next()
  }
}

module.exports = {
  findUserById
}