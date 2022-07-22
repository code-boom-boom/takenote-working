import React, { useEffect } from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import CategoryList from './AppSidebar'
import { Dispatch } from 'redux'
import { loadCategories, loadNotes } from '../actions'
import { connect } from 'react-redux'
import { KeyboardProvider } from '../contexts/KeyboardContext'
import { ApplicationState } from '../types'

interface AppProps {
  loadNotes: () => void
  loadCategories: () => void
  dark?: boolean
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories, dark }) => {
  let themeClass = ''

  if (dark) {
    themeClass = 'dark'
  }

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  return (
    <div className={`app ${themeClass}`}>
      <KeyboardProvider>
        <CategoryList />
        <NoteList />
        <NoteEditor />
        <KeyboardShortcuts />
      </KeyboardProvider>
    </div>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  dark: state.themeState.dark,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadNotes: () => dispatch(loadNotes()),
  loadCategories: () => dispatch(loadCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
