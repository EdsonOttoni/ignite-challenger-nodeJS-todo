const {validate} = require('uuid')

function checksTodoExists (request, response, next) {
    const {user} = request
    const {username} = request.headers
    const id = request.params.id

    if(!validate(id)){
      return response.status(404).json({error: "Uuid not validate"})
    }

    if(user.username !== username){
      return response.status(404).json({error: "User not compatible"})
    }

    const todo = user.todos.find(todo => todo.id === id)
    if(!todo){
      return response.status(404).json({error: "Todo not found"})
    }

    request.todo = todo
    request.user = user

    return next()

  }


module.exports = {
  checksTodoExists
}