import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CREATE_DOCUMENT, GET_MY_DOCUMENTS } from '../queries';

const styles = {
  editorContainer: {
    height: '70vh'
  },
  submitButton: {
    width: '10vw'
  }
};

function CreateDocumentPage({ history }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleTitleChange = e => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const resetFields = () => {
    setContent('');
    setTitle('');
  };

  return (
    <div
      className="d-flex flex-column mr-auto ml-auto mt-5 w-75 bg-light"
      style={styles.editorContainer}
    >
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Document Title..."
          aria-label="Title"
          aria-describedby="document title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onInit={editor => {
          // "editor" available when needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      <Mutation
        mutation={CREATE_DOCUMENT}
        onCompleted={async () => {
          await resetFields();
          history.push('/documents');
        }}
        refetchQueries={() => [
          {
            query: GET_MY_DOCUMENTS
          }
        ]}
        onError={error => {
          console.log('error', error);
        }}
      >
        {createDocument => (
          <button
            type="button"
            className="btn btn-primary btn-lg mt-3 ml-auto mr-3"
            style={styles.submitButton}
            onClick={async event => {
              event.preventDefault();
              await createDocument({
                variables: {
                  title,
                  content
                }
              });
            }}
          >
            Save Document
          </button>
        )}
      </Mutation>
    </div>
  );
}

CreateDocumentPage.propTypes = {
  history: PropTypes.object
};

export default withRouter(CreateDocumentPage);
