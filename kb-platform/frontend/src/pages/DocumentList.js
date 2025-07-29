// src/pages/DocumentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h2>Your Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              <h3>{doc.title}</h3>
              <p>{doc.content.slice(0, 100)}...</p>
              <p><strong>Visibility:</strong> {doc.private ? "Private" : "Public"}</p>
              {/* Optional: Add Edit/Delete buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
