import { Enums } from 'constants/enums';

export const addNote = note => ({
  type: Enums.ADD_NOTE,
  payload: note
})

export const updateNote = note => ({
  type: Enums.UPDATE_NOTE,
  payload: note,
})

export const swapNote = noteId => ({
  type: Enums.SWAP_NOTE,
  payload: noteId,
})