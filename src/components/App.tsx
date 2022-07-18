import React from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import Navigation from 'containers/Navigation'

const App: React.FC = () => {
  return (
    <div className="app">
      <Navigation />
      <NoteList />
      <NoteEditor />
    </div>
  )
}

export default App
