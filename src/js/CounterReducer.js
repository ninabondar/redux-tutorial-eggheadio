import expect from 'expect';
import {createStore} from 'redux';

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

const store = createStore(counter);
const render = ()=>{
    document.body.innerText = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', ()=>{store.dispatch({type: 'INCREMENT'})
});

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
