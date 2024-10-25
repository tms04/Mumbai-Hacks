import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["CSV"]; // Specify CSV as the only file type

function Upload() {
  const [salesFiles, setSalesFiles] = useState([]);
  const [purchaseFiles, setPurchaseFiles] = useState([]);

  const handleSalesChange = (newFile) => {
    if (salesFiles.length < 2) {
      setSalesFiles((prevFiles) => [...prevFiles, newFile]);
    } else {
      alert("You can only upload a maximum of 2 sales files.");
    }
  };

  const handlePurchaseChange = (newFile) => {
    if (purchaseFiles.length < 2) {
      setPurchaseFiles((prevFiles) => [...prevFiles, newFile]);
    } else {
      alert("You can only upload a maximum of 2 purchase files.");
    }
  };

  const handleRemoveSales = (fileToRemove) => {
    setSalesFiles(salesFiles.filter((file) => file !== fileToRemove));
  };

  const handleRemovePurchase = (fileToRemove) => {
    setPurchaseFiles(purchaseFiles.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sales files submitted:", salesFiles);
    console.log("Purchase files submitted:", purchaseFiles);
    alert("Files submitted successfully!");
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '20px',
  };

  const uploaderStyle = {
    width: '400px',
    height: '200px',
    border: '2px dashed #007BFF',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const fileListStyle = {
    marginTop: '20px',
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Upload Your CSV Files</h1>

      {/* Sales Upload Section */}
      <h2>Sales Files</h2>
      <div style={uploaderStyle}>
        <FileUploader
          handleChange={handleSalesChange}
          name="salesFile"
          types={fileTypes}
          multiple
        />
      </div>
      <div style={fileListStyle}>
        {salesFiles.map((file, index) => (
          <div key={index}>
            {file.name}{" "}
            <button onClick={() => handleRemoveSales(file)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Purchase Upload Section */}
      <h2>Purchase Files</h2>
      <div style={uploaderStyle}>
        <FileUploader
          handleChange={handlePurchaseChange}
          name="purchaseFile"
          types={fileTypes}
          multiple
        />
      </div>
      <div style={fileListStyle}>
        {purchaseFiles.map((file, index) => (
          <div key={index}>
            {file.name}{" "}
            <button onClick={() => handleRemovePurchase(file)}>Remove</button>
          </div>
        ))}
      </div>

      <button style={submitButtonStyle} onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Upload;
