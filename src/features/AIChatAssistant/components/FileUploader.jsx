// ─────────────────────────────────────────────────────────────────────────────
// FileUploader.jsx
// Hidden file input trigger with preview display in input bar
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef } from "react";

/**
 * FileUploader provides two trigger buttons (image + document) that open
 * the respective file selection dialogs. Selected files are passed to the
 * parent via the onFilesAdded callback.
 *
 * Props:
 * @param {Function} onFilesAdded  - Called with an array of selected File objects
 * @param {string}   accept        - MIME types string for the file input
 * @param {string}   inputId       - Unique id for the file input element
 * @param {React.ReactNode} children - The button trigger (icon/label)
 */
function FileUploader({ onFilesAdded, accept, inputId, children }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input so the same file can be re-selected if removed
    e.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="ai-file-input"
        accept={accept}
        multiple
        onChange={handleChange}
        aria-label="Upload file"
      />
      {/* Render the trigger button, forwarding click to hidden input */}
      <span onClick={() => inputRef.current?.click()}>{children}</span>
    </>
  );
}

export default FileUploader;
