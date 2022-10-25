const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const { checksExistsUserAccount } = require('./middlewares/checksExistsUserAccount');
const { checksCreateTodosUserAvailability } = require('./middlewares/checksCreateTodosUserAvailability');
const { checksTodoExists } = require('./middlewares/checksTodoExists');
const { findUserById } = require('./middlewares/findUserById');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


app.post('/users',(request, response) => {
  const {name, username, tier} = request.body

  const user = users.find(user => user.username === username)

  if(user){
    return response.status(400).json(
      {
        message: 'User already exists'
      })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
    tier
  }
  
  users.push(newUser)

  return response.status(201).json(newUser);
})

app.get('/users/:id', findUserById ,(request, response) => {
  const id = request.params.id

  const user = users.find(user => user.id === id)

  return response.status(201).json(user)
})

app.use(checksExistsUserAccount(users))

app.get('/todos', (request, response) => {
  const {user} = request

  return response.status(201).json(user.todos)
});

app.post('/todos', checksCreateTodosUserAvailability(users),(request, response) => {
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

app.put('/todos/:id', checksTodoExists,(request, response) => {
  const {user} = request
  const {title, deadline} = request.body

  const todo = user.todos.find(todo => todo.id === request.params.id)

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksTodoExists,(request, response) => {
  const {user} = request
  const {done} = request.body

  const todo = user.todos.find(todo => todo.id === request.params.id)

  todo.done = done

  return response.status(201).send()
});

app.delete('/todos/:id', checksTodoExists,(request, response) => {
  const {user} = request

  user.todos.splice(todo,1)

  return response.status(204).send()
});

module.exports = app;