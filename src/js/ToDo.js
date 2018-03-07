import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { combineReducers } from 'redux';
import Redux from 'redux';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';


//logics of updating a todoItem must be saved in another place(function), not right in the reducer:


let todoId = 0;
let nextTodoId = 0;

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

const todoApp = combineReducers(
    {
        visibilityFilter,
        todos
    }
);

const store = createStore(todoApp);

const {Component} = React;

const Todo = ({
    onClick,
    completed,
    text
              }) => (
        <li onClick={onClick}
        style={{textDecoration: completed ? 'line-through': 'none'}}>
        {text}
    </li>
);

const TodoList = ({
        todos, onTodoClick
    }) => (
        <ul>
            {todos.map(todo =>
        <Todo key={todo.id}
              {...todo}
            onClick={()=>onTodoClick(todo.id)}
            />
            )}
        </ul>
);

const AddTodo = () => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
                }
            }/>
            <button
                onClick={()=> {
                    store.dispatch({
                        type:"ADD_TODO",
                        id: nextTodoId++,
                        text: input.value
                    });
                    input.value = '';
                }}>
                NEW TODO
            </button>
        </div>
    )
};

const getVisibleTodos = (todos, filter) => {
    switch(filter){
        case "SHOW_ALL":
            return todos;
        case "SHOW_ACTIVE":
            return todos.filter(t=>t.completed);
        case "SHOW_COMPLETED":
            return todos.filter(t=> !t.completed);
    }
};

const Link = (
                    active,
                    children,
                    onClick) => {
    if
    (active) {
        return (
            <span>{children}</span>
        )
    }
    return (
        <a href="#"
           onClick={e => {e.preventDefault();
           onClick();
           }}>
            {children}
        </a>
    )
};

class FilterLink extends Component {
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=> this.forceUpdate())
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    render(){
        const props = this.props;
        const state = store.getState();
        return(
           <div>
            <Link active={props.filter === state.visibilityFilter}
            onClick={() => store.dispatch({
                type: "SET_VISIBILITY_FILTER",
                filter: props.filter
                })
            }/>{props.children}
            </div>
        )
    }

}

const Footer = () => (
        <p>Show:
            {' '}
            <FilterLink filter="SHOW_ALL"
            >All</FilterLink>
            {' , '}
            <FilterLink filter="SHOW_ACTIVE"
                        >Active</FilterLink>
            {' , '}
            <FilterLink filter="SHOW_COMPLETED"
                        >Completed</FilterLink>
        </p>
    );

class VisibleTodoList extends  Component{
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=> this.forceUpdate())
    }

    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        const props = this.props;
        const state = store.getState();
        return(
            <TodoList
            todos={getVisibleTodos(state.todos,
                   state.visibilityFilter)}
            onTodoClick={id=> store.dispatch({
                type:"TOGGLE_TODO",
                id
            })}/>
        )
    }
}

const TodoApp = () =>
    (
               <div>
                   <AddTodo/>
                  <VisibleTodoList/>
                   <Footer />
        </div>);

    ReactDOM.render(<TodoApp/>, document.getElementById('root')
    );

store.subscribe(render);

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