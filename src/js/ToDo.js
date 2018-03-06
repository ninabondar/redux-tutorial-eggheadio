import deepFreeze from 'deep-freeze';
import expect from 'expect';
import Redux from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';


//logics of updating a todoItem must be saved in another place(function), not right in the reducer:
const todo = (state, action) => {
    switch(action.type){
        case "ADD_TODO":
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case "TOGGLE_TODO":
            if(state.id !== action.id){
                return state;
            }
            return {
                id: state.id,
                text: state.text,
                completed: !state.completed
            };
        default:
            return state;
    }
};

//reducer for todoList: a pure func that describes logics of changing the state( === changing todos) of this app
const todos = (state = [], action) => {
  switch (action.type){
      case 'ADD_TODO':
          return [...state, todo(undefined, action)
          ];
      case "TOGGLE_TODO":
          return state.map(t => todo(t, action));
      default:
          return state;
  }
};

const visibilityFilter = (state="SHOW_ALL", action) => {
    switch(action.type){
        case "SET_VISIBILITY_FILTER":
            return action.filter;
        default:
            return state;
    }
};

const {Component} = React;
let todoId = 0;

class TodoApp extends Component {

    render(){
        return  (<div>
            <input ref={node => {
                this.input = node;
                }
            }/>
            <button
            onClick={()=> {store.dispatch({
                type: "ADD_TODO",
                text:this.input.value,
                id:todoId++
                });
                this.input.value = '';
            }}>
                NEW TODO
            </button>

            <ul>
                {
                    this.props.todos.map(todo =>
                        <li key={todo.id}
                        onClick={()=> {
                            store.dispatch({
                                type: "TOGGLE_TODO",
                                id: todo.id
                            });
                            style={textDecoration:
                                todo.completed ? "line-through":
                                    "none"
                                }
                            }}>
                            {todo.text}
                            </li>
                    )
                }
            </ul>
        </div>)
    }

};

const render = () => {
    ReactDOM.render(<TodoApp todos={store.getState().todos}/>, document.getElementById('root')
    );
};
store.subscribe(render);

const { combineReducers } = Redux;
const todoApp = combineReducers(
    {
        visibilityFilter,
        todos
    }
);


const { createStore } =  Redux;
const store = createStore(todoApp);
store.dispatch(
    {
    type: "ADD_TODO",
    id: 0,
    text: "LEARN Redux"
    }
);

console.log('current state: ' + store.getState());
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