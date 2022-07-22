import React, { useEffect } from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import CategoryList from './AppSidebar'
import { Dispatch } from 'redux'
import { loadCategories, loadNotes } from '../actions'
import { connect } from 'react-redux'
import { KeyboardProvider } from '../contexts/KeyboardContext'

interface AppProps {
  loadNotes: () => void
  loadCategories: () => void
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories }) => {
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  return (
    <div className="app">
      <KeyboardProvider>
        <CategoryList />
        <NoteList />
        <NoteEditor />
        <KeyboardShortcuts />
      </KeyboardProvider>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadNotes: () => dispatch(loadNotes()),
  loadCategories: () => dispatch(loadCategories()),
})

export default connect(null, mapDispatchToProps)(App)
