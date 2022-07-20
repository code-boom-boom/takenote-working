import { Actions } from 'constants/enums'
import { NotesActionTypes, NoteState } from '../types'

const initialState: NoteState = {
  notes: [],
  activeNoteId: '',
  loading: true,
  error: '',
}

const noteReducer = (state = initialState, action: NotesActionTypes): NoteState => {
  switch (action.type) {
    case Actions.LOAD_NOTES:
      return initialState
    case Actions.LOAD_NOTES_SUCCESS:
      return {
        ...state,
        notes: action.payload,
        activeNoteId: action.payload.length > 0 ? action.payload[0].id : '',
        loading: false,
      }
    case Actions.LOAD_NOTES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case Actions.SWAP_NOTE:
      return {
        ...state,
        activeNoteId: action.payload,
      }
    case Actions.PRUNE_NOTES:
      return {
        ...state,
        notes: state.notes.filter(note => note.text !== '' || note.id === state.activeNoteId),
      }
    case Actions.ADD_NOTE:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      }
    case Actions.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? {
                id: note.id,
                text: action.payload.text,
                created: note.created,
                lastUpdated: action.payload.lastUpdated,
              }
            : note
        ),
      }
    case Actions.DELETE_NOTE:
      const deletedNoteIndex = state.notes.findIndex(note => note.id === action.payload)
      let newActiveNoteId = ''

      if (deletedNoteIndex === 0 && state.notes[1]) {
        newActiveNoteId = state.notes[deletedNoteIndex + 1].id
      } else if (state.notes[deletedNoteIndex - 1]) {
        newActiveNoteId = state.notes[deletedNoteIndex - 1].id
      }

      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        activeNoteId: newActiveNoteId,
      }
    case Actions.ADD_CATEGORY_TO_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                id: note.id,
                text: note.text,
                created: note.created,
                lastUpdated: note.lastUpdated,
                category: action.payload.categoryId,
              }
            : note
        ),
      }
    default:
      return state
  }
}

export default noteReducer
