import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "./FileViewer.css";

export default class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [
        {
          uri: require("./Normal.docx"),
          fileType: "docx",
          fileName: "Normal.docx",
        },
      ],
      isOpen: true,
      isDragging: false,
    };
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  };

  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isDragging: true });
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isDragging: false });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isDragging: false });

    const file = e.dataTransfer.files[0];
    if (file) {
      this.processFile(file);
    }
  };

  processFile = (file) => {
    const fileType = file.name.split(".").pop().toLowerCase();
    const allowedTypes = [
      "pdf",
      "docx",
      "doc",
      "txt",
      "xlsx",
      "xls",
      "pptx",
      "ppt",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "ico",
      "svg",
      "webp",
    ];

    if (!allowedTypes.includes(fileType)) {
      alert("Please upload only PDF or DOCX documents");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    this.setState({
      docs: [
        ...this.state.docs,
        {
          uri: objectUrl,
          fileType: fileType,
          fileName: file.name,
        },
      ],
      isOpen: true,
    });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
    if (this.state.docs.length > 0) {
      this.state.docs.forEach((doc) => {
        if (doc.uri) URL.revokeObjectURL(doc.uri);
      });
      this.setState({ docs: [] });
    }
  };

  componentWillUnmount() {
    if (this.state.docs.length > 0) {
      this.state.docs.forEach((doc) => {
        if (doc.uri) URL.revokeObjectURL(doc.uri);
      });
    }
  }

  render() {
    const { docs, isOpen, isDragging } = this.state;

    return (
      <div className="file-viewer-container">
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          <div className="upload-area">
            <i className="upload-icon">📄</i>
            <p>Drag & Drop your document here or</p>
            <label className="upload-button">
              Choose File
              <input
                type="file"
                onChange={this.handleFileChange}
                accept=".pdf,.docx,.doc"
                style={{ display: "none" }}
              />
            </label>
            <p className="file-types">Supported files: PDF, DOC, DOCX</p>
          </div>
        </div>

        {isOpen && docs.length > 0 && (
          <div className="viewer-container">
            <button
              onClick={this.handleClose}
              className="close-button"
              aria-label="Close viewer"
            >
              ✕
            </button>
            <DocViewer
              documents={docs}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                },
              }}
              style={{
                height: "100%",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
