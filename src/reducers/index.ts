import { combineReducers, Reducer } from 'redux'
import noteReducer from 'reducers/noteReducer'
import categoryReducer from './categoryReducer'
import syncReducer from './syncReducer'
import themeReducer from './themeReducer'
import { ApplicationState } from '../types'

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  noteState: noteReducer,
  categoryState: categoryReducer,
  syncState: syncReducer,
  themeState: themeReducer,
})

export default rootReducer
