import { combineReducers } from 'redux';
import active from './activeReducer';
import notes from './noteReducer';

export default combineReducers({
  active,
  notes
} as any)