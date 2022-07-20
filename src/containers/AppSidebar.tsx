import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ApplicationState, CategoryItem, NoteItem } from '../types'
import {
  addCategory,
  deleteCategory,
  pruneCategoryFromNotes,
  swapCategory,
  swapNote,
} from '../actions'
import kebabCase from 'lodash/kebabCase'

interface AppProps {
  addCategory: (category: CategoryItem) => void
  deleteCategory: (categoryId: string) => void
  pruneCategoryFromNotes: (categoryId: string) => void
  swapCategory: (categoryId: string) => void
  swapNote: (swapNote: string) => void
  notes: NoteItem[]
  categories: CategoryItem[]
  activeCategoryId: string
}

const AppSidebar: React.FC<AppProps> = ({
  addCategory,
  deleteCategory,
  pruneCategoryFromNotes,
  swapCategory,
  swapNote,
  notes,
  categories,
  activeCategoryId,
}) => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLInputElement>
  ) => {
    event.preventDefault()

    const category = { id: kebabCase(tempCategory), name: tempCategory }

    if (!categories.find(cat => cat.id === kebabCase(tempCategory))) {
      addCategory(category)

      setTempCategory('')
      setAddingTempCategory(false)
    }
  }

  return (
    <aside className="app-sidebar">
      <section id="app-sidebar-main">
        <div
          className="app-sidebar-link"
          onClick={() => {
            const newNoteId = notes.length > 0 ? notes[0].id : ''
            swapCategory('')
            swapNote(newNoteId)
          }}
        >
          Notes
        </div>

        <div className="category-title vbetween">
          <h2>Categories</h2>
          <button className="add-button" onClick={newTempCategoryHandler}>
            +
          </button>
        </div>
        <div className="category-list">
          {categories.map(category => {
            return (
              <div
                className={
                  category.id === activeCategoryId ? 'category-each active' : 'category-each'
                }
                key={category.id}
                onClick={() => {
                  const notesForNewCategory = notes.filter(note => note.category === category.id)
                  const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                  if (category.id !== activeCategoryId) {
                    swapCategory(category.id)
                    swapNote(newNoteId)
                  }
                }}
              >
                <div>{category.name}</div>
                <div
                  className="category-options"
                  onClick={() => {
                    const newNoteId = notes.length > 0 ? notes[0].id : ''
                    deleteCategory(category.id)
                    pruneCategoryFromNotes(category.id)
                    swapCategory('')
                    swapNote(newNoteId)
                  }}
                >
                  X
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form className="add-category-form" onSubmit={onSubmit}>
            <input
              autoFocus
              placeholder="New category..."
              onChange={event => {
                setTempCategory(event.target.value)
              }}
              onBlur={event => {
                if (!tempCategory) {
                  setAddingTempCategory(false)
                } else {
                  onSubmit(event)
                }
              }}
            />
          </form>
        )}
      </section>
    </aside>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  activeCategoryId: state.categoryState.activeCategoryId,
  categories: state.categoryState.categories,
  notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
  addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
  deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
  pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)
