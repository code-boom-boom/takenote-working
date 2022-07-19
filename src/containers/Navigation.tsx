import React from 'react'
import { addNote, deleteNote, swapNote, syncState } from 'actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { NoteItem } from '../types'
import { downloadNote, getNoteTitle } from '../helpers'
import { useKey } from '../helpers/hooks'

interface NavigationProps {
  addNote: Function
  swapNote: Function
  deleteNote: Function
  activeNote: NoteItem
  syncState: Function
  notes: NoteItem[]
  syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  activeNote,
  addNote,
  swapNote,
  deleteNote,
  syncState,
  notes,
  syncing,
}) => {
  const newNoteHandler = () => {
    const note = { id: uuid(), text: '', created: '', lastUpdated: '' }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const deleteNoteHandler = () => {
    if (activeNote) {
      deleteNote(activeNote.id)
    }
  }

  const syncNoteHandler = () => {
    syncState(notes)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote.text)
    }
  }

  useKey('ctrl+n', () => {
    newNoteHandler()
  })

  useKey('ctrl+backspace', () => {
    deleteNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNoteHandler()
  })

  return (
    <nav className="navigation">
      <button className="nav-button" onClick={newNoteHandler}>
        + New Note
      </button>
      <button className="nav-button" onClick={deleteNoteHandler}>
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

const mapStateToProps = state => ({
  syncing: state.noteState.syncing,
  notes: state.noteState.notes,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: note => dispatch(addNote(note)),
  swapNote: noteId => dispatch(swapNote(noteId)),
  deleteNote: noteId => dispatch(deleteNote(noteId)),
  syncState: notes => dispatch(syncState(notes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
