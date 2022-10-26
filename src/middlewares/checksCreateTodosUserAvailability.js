function checksCreateTodosUserAvailability(users){
  return function (request, response, next) {
    const {user} = request

    if(user.tier === 'free' && user.todos.length >= 10){
      return response.status(400).json({
        error: 'You can not create more than 10 todos'
      })
    }

    return next()
  }
}

module.exports = {
  checksCreateTodosUserAvailability
}