import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "./FileViewer.css";

export default class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [
        {
          uri: "https://doc-0k-60-docstext.googleusercontent.com/export/ilhq09edrr4v3npss4u97ss0uo/ojsjlclvirj8ttfaa79mj3cr14/1736838090000/102501244511121760741/102501244511121760741/16GTyycHFsmOQ4UZGfo3w7QMQj4MATDqduZ30pAAfWi8?format=docx&dat=AOBvIb3msaW7QjGbxBAbREAGwpnMhelOma_VhyxvFkdzmGN-Q3IftFHB34nAipsH0i8hrwLhOlgc86HVDS70z5yF33XI8i99A1ki1ic8A1lTP7PAwXZmdRp09WATWzqAix0tNsN_DyfUoRZXn3oJfBAI7quscecaFTvnPsbwxhFTvpTOYUK6qIcjzV8ncYBqEKmyI3yKSjBncTdZlsOq_DL6ICRvjHI8CG20K9WZ5vzdboaYq3P9SvIeNx9AHqn3kWIx2y-cDbJz0u_F1cvMxj0Mm6sx694UlUh7NRHWos9YLRQSGVwwzF3qnboDBwUwwoQOMXlTM4U0waxVx0_5w3PHndYi20SBD5cExgOer2gpVXgHF2cAggJnswYrtz-CVC4vE36siJ5m-3oQZHixjpOtUp_QvMfIZWUa-gLXCXxCgNcJMLAX5pCFBzrCWTWwTZSVUQPb49j9OcfljYNTDLqZizsoRWSDT17DDAssLBmMLKw_Brrp49BzyrL2MHQa8DKRbLy3ORf4wvkp2CS3W2e4tVAUDIrj2zwt6e2_8ZFjRwqJyBJD6vuAZjE1IArJ29QtaJM3PMcrgIZIJTrWS-vwR6FiAadXCncZNW7zUHkLpl9TYETL2iRQ1CGsj1vlUU2gQhwRKQJoXcX_jivM2Udebr6GlIUTW6jv8aUIRC6A9Pp8hGDnWUzOJe-ka3VxVOhS5CKw0iYiFDBkkSma8L2TG4Q4mFmafCkR8Rl1JXWnWhfbu5PXHfJy6DbVxaHb5D-fDVfWazhVxtPbm6J3bzL1Ds_R2LLl99sGvuNFOF4Rh_adHbXMXHeYFeW29hWBeo-mQkUZFq5k498Za_Ra0MUIPC_aooxxNAVZlJzA-uva2ZPmwfY9CtFpHcj7dZqX-2G1TJx1krTc8gHZUfDRyyqW9InYl5-Fg7TgdtCSU26B90vjTJkBChKWLDOb79U",
          fileType: "docx",
        },
      ],
      isUploading: false,
    };
  }

  handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ isUploading: true });

      try {
        // Convert file to base64
        const base64String = await this.convertToBase64(file);

        // Add to docs array
        this.setState((prevState) => ({
          docs: [
            ...prevState.docs,
            {
              uri: base64String,
              fileName: file.name,
            },
          ],
          isUploading: false,
        }));
      } catch (error) {
        console.error("Error:", error);
        this.setState({ isUploading: false });
        alert("Error processing file. Please try again.");
      }
    }
  };

  convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    const { docs, isUploading } = this.state;

    return (
      <div className="file-viewer-container">
        <div className="upload-area">
          <label className="upload-button">
            Upload File
            <input
              type="file"
              onChange={this.handleFileChange}
              accept=".pdf,.docx,.doc"
              style={{ display: "none" }}
            />
          </label>
          {isUploading && <p>Uploading...</p>}
        </div>

        {docs.length > 0 && (
          <div className="viewer-container">
            <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                },
              }}
              style={{
                height: 500,
                width: "100%",
                maxWidth: "1200px",
                margin: "20px auto",
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
