const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      // GOOD + 1
      return {...state, good:state.good + 1}
    case 'OK':
      // OK + 1
      return {...state, ok:state.ok + 1}
    case 'BAD':
      // BAD + 1
      return {...state, bad:state.bad + 1}
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default counterReducer
