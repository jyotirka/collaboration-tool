import React from 'react';
import Editor from '../components/Editor';
import DocumentList from "../components/DocumentList";

const Dashboard = () => {
  // TODO: Later we can load docId via router or state
  return (
    <div>
      <h2>Document Editor</h2>
      <Editor />
      <DocumentList />
    </div>
  );
};

export default Dashboard;
