import deepFreeze from 'deep-freeze';
import expect from 'expect';

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
      case "TOGGLE_TODO":
          return state.map(todo => {
             if(todo.id !== action.id){
                 return todo;
             }
             return {
                 id: todo.id,
                 text: todo.text,
                 completed: !todo.completed
             }
          });
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
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ];
    const action = {
        type: "TOGGLE_TODO",
        id: 1
    };
    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ];
    expect(todos(stateBefore, action)).toEqual(stateAfter);
    console.log('passed testToggleToDo')
};

testToggleToDo();