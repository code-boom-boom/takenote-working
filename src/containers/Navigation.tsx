import React from 'react'
import { addNote, deleteNote, swapNote } from 'actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { NoteItem } from '../types'

interface NavigationProps {
  addNote: Function
  swapNote: Function
  deleteNote: Function
  active: string
  activeNote: NoteItem
}

const Navigation: React.FC<NavigationProps> = ({
  addNote,
  swapNote,
  deleteNote,
  activeNote,
  active,
}) => {
  return (
    <nav className="navigation">
      <button
        className="nav-button"
        onClick={() => {
          const note = { id: uuid(), text: 'New note', created: '', lastUpdated: '' }
          addNote(note)
          swapNote(note.id)
        }}
      >
        + New Note
      </button>
      <button
        className="nav-button"
        onClick={() => {
          deleteNote(activeNote.id)
        }}
      >
        X Delete Note
      </button>
    </nav>
  )
}

const mapStateToProps = state => ({
  active: state.noteState.active,
  activeNote: state.noteState.data.find(note => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: note => dispatch(addNote(note)),
  swapNote: noteId => dispatch(swapNote(noteId)),
  deleteNote: noteId => dispatch(deleteNote(noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
