import React from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import Navigation from 'containers/Navigation'
import CategoryList from '../containers/AppSidebar'

const App: React.FC = () => {
  return (
    <div className="app">
      <CategoryList />
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

export default App
