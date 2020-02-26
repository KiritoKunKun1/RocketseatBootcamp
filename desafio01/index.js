const express = require('express');

const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "Projeto 1", tasks: ["Task 1, Task 2"] }];

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

function checkProjectIdExists(req, res, next) {
  const { id } = req.params;
  const projectId = projects.find(p => p.id == id);

  if (!projectId)
    return res.status(400).json({ error: 'Project does not exists' });
  
  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { tasksTitle } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks = tasksTitle;

  return res.json(project);
});

server.put('/projects/:id', checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

server.listen(3000);