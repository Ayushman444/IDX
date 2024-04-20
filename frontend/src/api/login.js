import { useNavigate } from "react-router-dom";

const {useState} = require("react");

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const login = async ({username, password}) => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }
			localStorage.setItem("username", username);

			navigate('/Home');

		}catch (error) {
            throw new Error(error.message || "Login failed");
        } finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;