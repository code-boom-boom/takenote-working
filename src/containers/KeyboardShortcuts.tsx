import React from 'react'
import { addNote, sendNoteToTrash, swapNote, syncState } from 'actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { ApplicationState, CategoryItem, NoteItem } from '../types'
import { downloadNote, getNoteTitle } from '../helpers'
import { useKey } from '../helpers/hooks'
import moment from 'moment'

interface KeyboardShortcutsProps {
  addNote: (note: NoteItem) => void
  swapNote: (noteId: string) => void
  sendNoteToTrash: (noteId: string) => void
  activeNote?: NoteItem
  activeCategoryId: string
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  notes: NoteItem[]
  categories: CategoryItem[]
  syncing: boolean
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  activeNote,
  activeCategoryId,
  addNote,
  swapNote,
  sendNoteToTrash,
  syncState,
  notes,
  categories,
}) => {
  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuid(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
      category: activeCategoryId ? activeCategoryId : undefined,
    }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const trashNoteHandler = () => {
    if (activeNote && !activeNote.trash) {
      sendNoteToTrash(activeNote.id)
    }
  }

  const syncNoteHandler = () => {
    syncState(notes, categories)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote)
    }
  }

  useKey('ctrl+n', () => {
    newNoteHandler()
  })

  useKey('ctrl+w', () => {
    trashNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNoteHandler()
  })

  useKey('ctrl+d', () => {
    downloadNoteHandler()
  })

  return null
}

const mapStateToProps = (state: ApplicationState) => ({
  syncing: state.syncState.syncing,
  notes: state.noteState.notes,
  categories: state.categoryState.categories,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
  activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcuts)
