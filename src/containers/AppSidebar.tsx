import uuid from 'uuid/v4'
import React, { useState } from 'react'
import {
  Book,
  Bookmark,
  Folder as FolderIcon,
  Loader,
  Plus,
  Settings,
  Trash2,
  UploadCloud,
  X,
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

import { Folder } from 'constants/enums'
import { useTempState } from 'contexts/TempStateContext'
import { newNote } from 'helpers'
import { addCategory, deleteCategory, updateCategory } from 'slices/category'
import {
  addCategoryToNote,
  addNote,
  pruneCategoryFromNotes,
  swapCategory,
  swapFolder,
  swapNote,
  toggleFavoriteNote,
  toggleTrashedNote,
} from 'slices/note'
import { toggleSettingsModal } from 'slices/settings'
import { syncState } from 'slices/sync'
import { CategoryItem, NoteItem, ReactDragEvent, ReactSubmitEvent, RootState } from 'types'
import AppSidebarAction from 'components/AppSidebarAction'
import { iconColor } from 'constants/index'

const AppSidebar: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.categoryState)
  const { activeCategoryId, activeFolder, activeNoteId, notes } = useSelector(
    (state: RootState) => state.noteState
  )
  const [editingCategoryId, setEditingCategoryId] = useState('')

  const activeNote = notes.find(note => note.id === activeNoteId)

  const dispatch = useDispatch()

  const _addNote = (note: NoteItem) => dispatch(addNote(note))
  const _swapNote = (noteId: string) => dispatch(swapNote(noteId))
  const _swapCategory = (categoryId: string) => dispatch(swapCategory(categoryId))
  const _swapFolder = (folder: Folder) => dispatch(swapFolder(folder))
  const _addCategory = (category: CategoryItem) => dispatch(addCategory(category))
  const _updateCategory = (category: CategoryItem) => dispatch(updateCategory(category))
  const _deleteCategory = (categoryId: string) => dispatch(deleteCategory(categoryId))
  const _pruneCategoryFromNotes = (categoryId: string) =>
    dispatch(pruneCategoryFromNotes(categoryId))
  const _syncState = (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState({ notes, categories }))
  const _toggleSettingsModal = () => dispatch(toggleSettingsModal())
  const _toggleTrashedNote = (noteId: string) => dispatch(toggleTrashedNote(noteId))
  const _toggleFavoriteNote = (noteId: string) => dispatch(toggleFavoriteNote(noteId))
  const _addCategoryToNote = (categoryId: string, noteId: string) =>
    dispatch(addCategoryToNote({ categoryId, noteId }))

  const {
    errorCategoryMessage,
    setErrorCategoryMessage,
    addingTempCategory,
    setAddingTempCategory,
  } = useTempState()
  const [tempCategory, setTempCategory] = useState('')
  const { syncing } = useSelector((state: RootState) => state.syncState)

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const newNoteHandler = () => {
    if (activeFolder === Folder.TRASH) {
      _swapFolder(Folder.ALL)
    }
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      const note = newNote(
        activeCategoryId,
        activeFolder === Folder.TRASH ? Folder.ALL : activeFolder
      )
      _addNote(note)
      _swapNote(note.id)
    }
  }

  const resetTempCategory = () => {
    setTempCategory('')
    setAddingTempCategory(false)
    setErrorCategoryMessage('')
  }

  const onSubmitCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = { id: uuid(), name: tempCategory.trim() }

    if (categories.find(cat => cat.name === tempCategory.trim())) {
      setErrorCategoryMessage('Category already exists!')
    } else {
      _addCategory(category)

      resetTempCategory()
    }
  }

  const syncNotesHandler = () => {
    _syncState(notes, categories)
  }

  const settingsHandler = () => {
    _toggleSettingsModal()
  }

  const allowDrop = (event: ReactDragEvent) => {
    event.preventDefault()
  }

  const trashNoteHandler = (event: ReactDragEvent) => {
    event.preventDefault()

    _toggleTrashedNote(event.dataTransfer.getData('text'))
  }

  const favoriteNoteHandler = (event: ReactDragEvent) => {
    event.preventDefault()

    _toggleFavoriteNote(event.dataTransfer.getData('text'))
  }

  return (
    <aside className="app-sidebar">
      <section className="app-sidebar-actions">
        {activeFolder !== Folder.TRASH && (
          <AppSidebarAction handler={newNoteHandler} icon={Plus} label="Create new note" />
        )}
        <AppSidebarAction
          handler={syncNotesHandler}
          icon={syncing ? Loader : UploadCloud}
          label="Sync notes"
        />
        <AppSidebarAction handler={settingsHandler} icon={Settings} label="Settings" />
      </section>
      <section className="app-sidebar-main">
        <div
          className={`app-sidebar-link ${activeFolder === Folder.ALL ? 'active' : ''}`}
          onClick={() => {
            _swapFolder(Folder.ALL)
          }}
        >
          <Book size={15} className="app-sidebar-icon" color={iconColor} />
          All Notes
        </div>
        <div
          className={`app-sidebar-link ${activeFolder === Folder.FAVORITES ? 'active' : ''}`}
          onClick={() => {
            _swapFolder(Folder.FAVORITES)
          }}
          onDrop={favoriteNoteHandler}
          onDragOver={allowDrop}
        >
          <Bookmark size={15} className="app-sidebar-icon" color={iconColor} />
          Favorites
        </div>
        <div
          className={`app-sidebar-link ${activeFolder === Folder.TRASH ? 'active' : ''}`}
          onClick={() => {
            _swapFolder(Folder.TRASH)
          }}
          onDrop={trashNoteHandler}
          onDragOver={allowDrop}
        >
          <Trash2 size={15} className="app-sidebar-icon" color={iconColor} />
          Trash
        </div>

        <div className="category-title v-between">
          <h2>Categories</h2>
          <button className="category-button" onClick={newTempCategoryHandler}>
            <Plus size={15} color={iconColor} />
          </button>
        </div>
        <div className="category-list">
          {errorCategoryMessage && (
            <div className="category-error-message">{errorCategoryMessage}</div>
          )}
          {categories.map(category => {
            return (
              <div
                key={category.id}
                className={`category-list-each ${category.id === activeCategoryId ? 'active' : ''}`}
                onClick={() => {
                  const notesForNewCategory = notes.filter(
                    note => !note.trash && note.category === category.id
                  )
                  const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                  if (category.id !== activeCategoryId) {
                    _swapCategory(category.id)
                    _swapNote(newNoteId)
                  }
                }}
                onDoubleClick={() => {
                  setEditingCategoryId(category.id)
                }}
                onBlur={() => {
                  setEditingCategoryId('')
                }}
                onDrop={event => {
                  event.preventDefault()

                  _addCategoryToNote(category.id, event.dataTransfer.getData('text'))
                }}
                onDragOver={allowDrop}
              >
                <form
                  className="category-list-name"
                  onSubmit={e => {
                    setEditingCategoryId('')
                    e.preventDefault()
                  }}
                >
                  <FolderIcon size={15} className="app-sidebar-icon" color={iconColor} />
                  {editingCategoryId === category.id ? (
                    <input
                      value={category.name}
                      onChange={event => {
                        _updateCategory({ ...category, name: event.target.value })
                      }}
                    />
                  ) : (
                    category.name
                  )}
                </form>
                <div
                  className="category-options"
                  onClick={() => {
                    const notesNotTrash = notes.filter(note => !note.trash)
                    const newNoteId = notesNotTrash.length > 0 ? notesNotTrash[0].id : ''

                    _deleteCategory(category.id)
                    _pruneCategoryFromNotes(category.id)
                    _swapFolder(Folder.ALL)
                    _swapNote(newNoteId)
                  }}
                >
                  <X size={12} />
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form className="category-form" onSubmit={onSubmitCategory}>
            <input
              autoFocus
              maxLength={20}
              placeholder="New category..."
              onChange={event => {
                setTempCategory(event.target.value)
              }}
              onBlur={event => {
                if (!tempCategory || tempCategory.trim() === '' || errorCategoryMessage) {
                  resetTempCategory()
                } else {
                  onSubmitCategory(event)
                }
              }}
            />
          </form>
        )}
      </section>
    </aside>
  )
}
export default AppSidebar
