import { useState, useEffect } from "react";
import axios from "axios";

const PredictionDisplay = () => {
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        await axios
          .get("http://localhost:4000/inventory/predict")
          .then((res) => {
            setPrediction(
              res.data.prediction || "No prediction data available"
            );
            console.log(prediction);
          });

        setLoading(false);
      } catch (err) {
        console.error("Axios error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 border rounded-lg shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 border rounded-lg shadow-sm">
        <div className="text-red-500 text-center">
          <p>Error loading prediction: {error}</p>
          <p className="text-sm mt-2">
            Please check that your backend server is running and the endpoint is
            correctly configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Sales Prediction Analysis</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
          {prediction}
        </pre>
      </div>
    </div>
  );
};

export default PredictionDisplay;
