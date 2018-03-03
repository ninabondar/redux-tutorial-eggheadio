import deepFreeze from 'deep-freeze';
import expect from 'expect';

const toggleToDo = (todoItem) => {
    return {                          //idk why {...todoItem} syntax doesn't work
        id: todoItem.id,
        text: todoItem.text,
        completed: !todoItem.completed
    };
};



//---------------------------------------------TESTS-----------------------------------------------


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