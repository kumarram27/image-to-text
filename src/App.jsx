import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // New state for drag and drop

  // Handle file upload from the input field
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setText(""); // Clear previous extracted text
    }
  };

  // Handle file drop from drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setText(""); // Clear previous extracted text
    }
  };

  // Drag event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle text extraction using Tesseract
  const handleTextExtraction = () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);

    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.floor(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div id="demo-content">
      <h1>Image to Text Converter</h1>

      <button onClick={handleTextExtraction} disabled={!image || loading}>
        {loading ? `Extracting... (${progress}%)` : "Extract Text"}
      </button>

      {/* Layout: Image on the left, extracted text on the right */}
      <div className="content">
        <div
          className={`drop-area ${isDragging ? "dragging" : ""}`} // Add a class to style when dragging
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ cursor: "pointer" }}
        >
          <div className="image-preview">
            {image ? (
              <img id="input" src={image} alt="Preview" />
            ) : (
              <div id="drop-instructions-main">
                Drop <span className="drop-instructions"></span>an image here or{" "}
                <span>
                  <label htmlFor="openFileInput" className="openFileInputLabel">
                    Select File
                  </label>
                  <input
                    type="file"
                    id="openFileInput"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-output">
          {loading ? (
            <div className="loading-section">
              <p>Recognizing Text...</p>
              <progress
                value={progress}
                max="100"
              ></progress>
            </div>
          ) : text ? (
            <textarea id="output-text" value={text} readOnly />
          ) : (
            <p>Extracted text will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
