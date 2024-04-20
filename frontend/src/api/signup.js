import { useState } from 'react';

const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const signup = async ({ username, email, password }) => {
        setLoading(true);
        try {
            console.log(username);
            const res = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }
            console.log(data);
            // Handle success
            // toast.success("Signup successful!");
        } catch (error) {
            throw new Error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;
