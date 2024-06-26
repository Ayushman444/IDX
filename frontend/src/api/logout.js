import { useNavigate } from "react-router-dom";

const { useState } = require("react");

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			console.log("Logged out successfully");
			localStorage.clear();
			navigate('/');
		} catch (error) {
			throw new Error(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;