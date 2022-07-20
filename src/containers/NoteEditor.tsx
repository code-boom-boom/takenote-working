import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { updateNote } from 'actions'
import { ApplicationState, NoteItem } from 'types'
import options from 'constants/codeMirrorOptions'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/selection/active-line'
import moment from 'moment'

interface NoteEditorProps {
  loading: boolean
  activeNote?: NoteItem
  updateNote: (note: NoteItem) => void
}

const NoteEditor: React.FC<NoteEditorProps> = ({ loading, activeNote, updateNote }) => {
  if (loading) {
    return <div className="empty-editor vcenter">Loading...</div>
  } else if (!activeNote) {
    return <div className="empty-editor vcenter">Create a note!</div>
  } else {
    return (
      <CodeMirror
        className="editor mousetrap"
        value={activeNote.text}
        options={options}
        editorDidMount={editor => {
          editor.focus()
        }}
        onBeforeChange={(editor, data, value) => {
          updateNote({
            id: activeNote.id,
            text: value,
            created: activeNote.created,
            lastUpdated: moment().format(),
          })
        }}
        onChange={(editor, data, value) => {}}
      />
    )
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  loading: state.noteState.loading,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateNote: (note: NoteItem) => dispatch(updateNote(note)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)
