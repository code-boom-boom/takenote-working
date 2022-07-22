import React from 'react'
import { addNote, toggleTrashedNote, swapNote, syncState } from 'actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ApplicationState, CategoryItem, NoteItem } from '../types'
import { downloadNote, getNoteTitle, newNote } from '../helpers'
import { useKey } from '../helpers/hooks'
import { useKeyboard } from '../contexts/KeyboardContext'

interface KeyboardShortcutsProps {
  addNote: (note: NoteItem) => void
  swapNote: (noteId: string) => void
  toggleTrashedNote: (noteId: string) => void
  activeNote?: NoteItem
  activeCategoryId: string
  activeFolder: string
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  notes: NoteItem[]
  categories: CategoryItem[]
  syncing: boolean
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  activeNote,
  activeCategoryId,
  activeFolder,
  addNote,
  swapNote,
  toggleTrashedNote,
  syncState,
  notes,
  categories,
}) => {
  const { addingTempCategory, setAddingTempCategory } = useKeyboard()
  const newNoteHandler = () => {
    const note = newNote(activeCategoryId, activeFolder)

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const trashNoteHandler = () => {
    if (activeNote) {
      toggleTrashedNote(activeNote.id)
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

  useKey('ctrl+c', () => {
    newTempCategoryHandler()
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
  activeFolder: state.noteState.activeFolder,
  categories: state.categoryState.categories,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
  activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  toggleTrashedNote: (noteId: string) => dispatch(toggleTrashedNote(noteId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcuts)
