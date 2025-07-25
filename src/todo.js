
export default class Todo {
  constructor(title, description, dueDate, priority, completed = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed; 
  }

  static fromJSON(data) {
   
    return new Todo(data.title, data.description, data.dueDate, data.priority, data.completed);
  }
}

export function createToDo({ title, description, dueDate, priority, completed = false }) {
  return new Todo(title, description, dueDate, priority, completed);
}