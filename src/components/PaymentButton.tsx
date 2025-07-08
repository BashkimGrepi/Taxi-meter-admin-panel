import { useState } from "react";
import axios from "axios";

export default function PaymentButton() {
    const [loading, setLoading] = useState(false);

    // this function is for the driver to create a payment link for the customer
    //move this component to the react-native app, so tthat the driver can create a payment link himself 
    const handlePayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8080/api/admin/viva/payments/create-link?amount=1000",//myöhemmin amountin (1000) tilalle tulee oikean kyydin hinta
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const paymentLink = response.data;
            console.log("Payment link created:", paymentLink);

            window.location.href = paymentLink; // Redirect to the payment link
        } catch (error) {
            console.error("Error creating payment link:", error);
            alert("Failed to create payment link. Please try again.");
        } finally {
            setLoading(false);
        }
    }
     return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            {loading ? "Luodaan maksulinkkiä..." : "Maksa nyt"}
        </button>
    );

}