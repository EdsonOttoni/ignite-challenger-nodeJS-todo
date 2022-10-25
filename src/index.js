const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const { checksExistsUserAccount } = require('./middlewares/checksExistsUserAccount');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.post('/users', (request, response) => {
  const {name, username} = request.body

  const user = users.find(user => user.username === username)

  if(user){
    response.status(401).json({message: 'Usuário já cadastrado.'})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })
  
  return response.status(201).json(users);
})

app.use(checksExistsUserAccount(users))

app.get('/todos', (request, response) => {
  const {user} = request

  return response.status(201).json(user.todos)
});

app.post('/todos', (request, response) => {
  const {title, deadline} = request.body
  const {user} = request

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).send()
});

app.put('/todos/:id', (request, response) => {
  const {user} = request
  const {title, deadline} = request.body

  const todo = user.todos.find(todo => todo.id === request.params.id)

  if (!todo) {
    return response.status(404).send()
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).send()
});

app.patch('/todos/:id/done', (request, response) => {
  const {user} = request
  const {done} = request.body

  const todo = user.todos.find(todo => todo.id === request.params.id)

  if (!todo) {
    return response.status(404).send()
  }

  todo.done = done

  return response.status(201).send()
});

app.delete('/todos/:id', (request, response) => {
  const {user} = request
  const todo = user.todos.find(todo => todo.id === request.params.id)

  if (!todo) {
    return response.status(404).send()
  }

  user.todos.splice(todo,1)

  return response.status(204).send()
});

module.exports = app;