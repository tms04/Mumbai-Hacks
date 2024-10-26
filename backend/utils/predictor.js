import axios from 'axios';  // Import axios for HTTP requests
import Groq from "groq-sdk";

// Initialize GROQ client
const groq = new Groq({ apiKey: "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" });

// Function to load transaction history from backend using a GET request
async function loadTransactionHistory() {
  try {
    const response = await axios.get('http://localhost:4000/basket/get/allbaskets'); // Replace with your actual endpoint
     const transactionHistory = response.data.data.flatMap(sale => 
      sale.items.map(item => ({
        date: sale.saleDate, // Use the sale date for all items in the sale
        productId: item.itemId, // Item ID from the items array
        quantitySold: item.quantity, // Quantity from the items array
        totalSalesValue: 0 // Placeholder for total sales value (you'll need to calculate or retrieve this)
      }))
    );
    return transactionHistory;
  } catch (error) {
    console.error("Error loading transaction history:", error);
    throw error;
  }
}

// Function to get predictions from GROQ
async function getGroqPrediction(transactionData) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Using this transaction history ${JSON.stringify(transactionData)}, predict the next month's sales.`,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// Main function to load data and get predictions
export async function generatePrediction() {
  try {
    const transactionHistory = await loadTransactionHistory();
    const prediction = await getGroqPrediction(transactionHistory);
    return prediction.choices[0]?.message?.content || "No prediction";
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
}
