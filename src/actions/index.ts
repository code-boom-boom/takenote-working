import { ActionType } from 'constants/enums'
import { NoteItem } from '../types'

export const addNote = (note: NoteItem) => ({
  type: ActionType.ADD_NOTE,
  payload: note,
})

export const updateNote = note => ({
  type: ActionType.UPDATE_NOTE,
  payload: note,
})

export const deleteNote = (noteId: string) => ({
  type: ActionType.DELETE_NOTE,
  payload: noteId,
})

export const swapNote = noteId => ({
  type: ActionType.SWAP_NOTE,
  payload: noteId,
})

export const pruneNotes = () => ({
  type: ActionType.PRUNE_NOTES,
})

export const loadNotes = () => ({
  type: ActionType.LOAD_NOTES,
})
