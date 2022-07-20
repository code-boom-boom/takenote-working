import React, { useEffect } from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import Navigation from 'containers/Navigation'
import CategoryList from '../containers/AppSidebar'
import { Dispatch } from 'redux'
import { loadCategories, loadNotes } from '../actions'
import { connect } from 'react-redux'

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
      <Navigation />
      <CategoryList />
      <NoteList />
      <NoteEditor />
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadNotes: () => dispatch(loadNotes()),
  loadCategories: () => dispatch(loadCategories()),
})

export default connect(null, mapDispatchToProps)(App)
