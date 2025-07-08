import { useNavigate } from "react-router-dom";
import React, { useState } from "react";


const Viva = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initiateVivaLink = async () => {
    setIsLoading(true);
    try {
      // Call your API to initiate the Viva link
      const response = await fetch("/api/viva/initiate");
      const { authUrl } = await response.json();
            
    } catch (error) {

      console.error("Error initiating Viva link:", error);
    }
      


    return (
      <div>
        <h1>Viva</h1>
        <p>Viva is a platform for creating and sharing interactive data visualizations.</p>
      </div>
    );
  }

}
export default Viva