import React, { useState } from "react";
import axios from "axios";

const Uploads = () => {
  const [purchaseFile, setPurchaseFile] = useState(null);
  const [salesFile, setSalesFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ purchase: "", sales: "" });

  const handleFileChange = (event, type) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type !== "text/csv") {
      alert("Please select a .csv file.");
      return;
    }

    if (type === "purchase") {
      setPurchaseFile(selectedFile);
    } else if (type === "sales") {
      setSalesFile(selectedFile);
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) {
      alert(`Please select a ${type} file first.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        type === "purchase"
          ? "http://localhost:4000/inventory/upload/purchase"
          : "http://localhost:4000/basket/upload/sales";

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [type]: `Upload successful: ${response.data.message}`,
      }));
    } catch (error) {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [type]: `Upload failed: ${
          error.response ? error.response.data.error : error.message
        }`,
      }));
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Upload Files
      </h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>
          Purchase File (.csv):
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, "purchase")}
        />
        <button
          onClick={() => handleUpload(purchaseFile, "purchase")}
          style={{
            display: "block",
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Upload Purchase File
        </button>
        <p style={{ color: "green" }}>{uploadStatus.purchase}</p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>
          Sales File (.csv):
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, "sales")}
        />
        <button
          onClick={() => handleUpload(salesFile, "sales")}
          style={{
            display: "block",
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Upload Sales File
        </button>
        <p style={{ color: "green" }}>{uploadStatus.sales}</p>
      </div>
    </div>
  );
};

export default Uploads;
