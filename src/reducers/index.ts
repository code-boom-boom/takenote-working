import { combineReducers } from 'redux';
import active from 'reducers/activeReducer';
import notes from 'reducers/noteReducer';

export default combineReducers({
  active,
  notes
} as any)