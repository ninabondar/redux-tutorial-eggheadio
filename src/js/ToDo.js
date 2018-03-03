import deepFreeze from 'deep-freeze';
import expect from 'expect';

const toggleToDo = (todoItem) => {
    return {                          //idk why {...todoItem} syntax doesn't work
        id: todoItem.id,
        text: todoItem.text,
        completed: !todoItem.completed
    };
};
//reducer for todoList: a pure func that describes logics of changing the state( === changing todos) of this app
const todos = (state = [], action) => {
  switch (action.type){
      case 'ADD_TODO':
          return [...state, {
              id: action.id,
              text: action.text,
              completed: false
              }
          ];
      default:
          return state;
  }
};

//---------------------------------------------TESTS-----------------------------------------------

const testAddTodo = () => {
  let stateBefore  = [];
  deepFreeze(stateBefore);
  const action = {
      type: "ADD_TODO",
      id: 0,
      text: 'Learn Redux'
  };
  deepFreeze(action);
  const stateAfter = [
      {
      id: 0,
      text: "Learn Redux",
      completed: false
      }
  ];

  expect(todos(stateBefore, action)).toEqual(stateAfter);
  console.log('passed testAddTodo')
};

testAddTodo();

const testToggleToDo = () => {
    let todoBefore = {
        id: 0,
        text: 'Eat a carrot',
        completed: false
    };

    let todoAfter = {
        id: 0,
        text: 'Eat a carrot',
        completed: true
    };

    deepFreeze(todoBefore);  //because state obj is immutable in Redux
    expect(toggleToDo(todoBefore)).toEqual(todoAfter);
    console.log('passed testToggleToDo')
};

testToggleToDo();