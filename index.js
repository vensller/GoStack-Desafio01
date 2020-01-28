const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use(async (req, res, next) => {
  console.count('Requisições');
  
  return next();
});

async function verifyProjectExists(req, res, next){
  if (!req.params.id || !projects.find(i => i.id == req.params.id)){
    return res.status(400).json({error: "O projeto não foi localizado com o ID informado!"});
  }

  next();
}

server.get('/projects', async (req, res) => {  
  return res.json(projects);
});

server.post('/projects', async (req, res) => {
  const {id, title} = req.body;

  projects.push({
    id,
    title
  });

  return res.json(projects);
});

server.post('/projects/:id/tasks', verifyProjectExists, async (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  const project = projects.find(i => i.id == id);
  
  if (!project.tasks){
    project.tasks = [title];
  }else project.tasks.push(title);

  return res.json(projects);
});

server.put('/projects/:id', verifyProjectExists, async (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  const project = projects.find(i => i.id == id);
    
  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', verifyProjectExists, async (req, res) => {
  const {id} = req.params;

  let index = projects.findIndex(i => i.id == id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3000);