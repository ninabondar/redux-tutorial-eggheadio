import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import  deepFreeze from 'deep-freeze';

const counter = (state = 0, action) => {
    switch (action.type){
        case 'INCREMENT':
            return state + 1;
            break;
        case "DECREMENT":
            return state  - 1;
            break;
        default:
            return state;
    }
};

const Counter = ({value, onIncrement, onDecrement}) =>(
    <div className="counter-container">
        <button className="increment-button" onClick={onIncrement}> +
        </button>
    <h1>
        {value}
    </h1>
    <button className="decrement-button" onClick={onDecrement}> -
    </button>
    </div>
);

const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) =>{
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };
    const subscribe = (listener) =>{
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };
    dispatch({});
    return {getState, dispatch, subscribe};
};

const store = createStore(counter);
const render = ()=>{
    ReactDOM.render(<Counter value={store.getState()} onIncrement={()=> store.dispatch({type: "INCREMENT"})}
                             onDecrement={()=> store.dispatch({type: "DECREMENT"})}/>, document.getElementById('root'));
};


const addCounter = (list)=>{
    return [...list, 0];  //this new ES6 syntax equals to 'list.concat([0])'
 };

const removeCounter = (list, ind)=>{
    return [...list.slice(0, ind), ...list.slice(ind+1)]
};

const incrementCounter = (list, ind) => {
    return [...list.slice(0, ind),
        list[ind]+1,
        ...list.slice(ind+1)]  //first slice before the mutable elem, then
    // change the wanted elem, then add the slice of everything after this elem
};



store.subscribe(render);
render();

expect(counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect(counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect(counter(2, {type: 'DECREMENT'})
).toEqual(1);

expect(counter(1, {type: 'DECREMENT'})
).toEqual(0);

expect(counter(1, {type: 'SOMETHING_ELSE'})
).toEqual(1);

expect(counter(undefined, {})
).toEqual(0);

console.log('passed ');

//------------------------------------------TESTS--------------------------------------------
const testAddCounter = () => {
    let listBefore = [];
    let listAfter = [0];
    deepFreeze(listBefore);
    expect(addCounter(listBefore)).toEqual(listAfter);
};

const testRemoveCounter = () =>{
    let listBefore = [0,10,20];
    let listAfter = [0, 20];
    deepFreeze(listBefore);

    expect(removeCounter(listBefore, 1)).toEqual(listAfter) ;
};

const testIncrementCounter = ( ) => {
    const listBefore = [0,10,20];
    const listAfter = [0, 11, 20];
    deepFreeze(listBefore);
    expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};

addCounter([2,3,4]);
testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('passed all tests');
//----------------------------------------END OF TESTS---------------------------------------


