import { combineReducers } from 'redux'
import noteReducer from 'reducers/noteReducer'
import categoryReducer from './categoryReducer'
import syncReducer from './syncReducer'

const rootReducer = combineReducers({
  noteState: noteReducer,
  categoryState: categoryReducer,
  syncState: syncReducer,
} as any)

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
