

import { createToDo } from "./todo.js";


export default function createProject(name){


   const todos=[];

   return {
    name,todos,
    addToDo(todo){
        todos.push(todo);
    },
    removeTodo(index){
        todos.splice(index,1);
    },

    getTodos(){
        return todos;

    },
    

  };
}
export function fromJSON(data) {
  const project = createProject(data.name);
  data.todos.forEach(todoData => {
    const todo = createToDo(todoData);
    project.addToDo(todo);
  });
  return project;
}