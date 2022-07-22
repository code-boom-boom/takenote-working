import React, { useEffect } from 'react'
// eslint-disable-next-line import/named
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import { KeyboardProvider } from 'contexts/KeyboardContext'
import { ApplicationState } from 'types'
import { loadCategories, loadNotes } from 'actions'
import CategoryList from 'containers/AppSidebar'

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
