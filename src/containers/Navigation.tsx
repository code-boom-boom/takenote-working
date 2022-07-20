import React from 'react'
import { addNote, sendNoteToTrash, swapNote, syncState } from 'actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { ApplicationState, CategoryItem, NoteItem } from '../types'
import { downloadNote, getNoteTitle } from '../helpers'
import { useKey } from '../helpers/hooks'
import moment from 'moment'

interface NavigationProps {
  addNote: (note: NoteItem) => void
  swapNote: (noteId: string) => void
  sendNoteToTrash: (noteId: string) => void
  activeNote?: NoteItem
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  notes: NoteItem[]
  categories: CategoryItem[]
  syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  activeNote,
  addNote,
  swapNote,
  sendNoteToTrash,
  syncState,
  notes,
  categories,
  syncing,
}) => {
  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuid(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
    }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const trashNoteHandler = () => {
    if (activeNote) {
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

  useKey('ctrl+backspace', () => {
    trashNoteHandler()
  })

  useKey('ctrl+w', () => {
    trashNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNoteHandler()
  })

  return (
    <nav className="navigation">
      <button className="nav-button" onClick={newNoteHandler}>
        + New Note
      </button>
      <button className="nav-button" onClick={trashNoteHandler}>
        X Delete Note
      </button>
      <button className="nav-button" onClick={downloadNoteHandler}>
        ^ Download Note
      </button>
      <button className="nav-button" onClick={syncNoteHandler}>
        Sync notes
        {syncing && 'Syncing...'}
      </button>
    </nav>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  syncing: state.syncState.syncing,
  notes: state.noteState.notes,
  categories: state.categoryState.categories,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
