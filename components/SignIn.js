import { createStore } from 'redux';

export function signIn(value) {
    return {
        type: 'signIn',
        valueOfState: value
    }
}

export function changeSignInValue(state, action) {
    if (state == undefined) {
        state = false
    }
    if (action.type == 'signIn') {
        return action.valueOfState
    } else {
        return state == false
    }
}

export const store = createStore(changeSignInValue);