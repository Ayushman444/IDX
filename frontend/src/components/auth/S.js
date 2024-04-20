import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useSignup from '../../api/signup';

export const S = () => {
    const { loading, signup } = useSignup();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        showPassword: false // New state to toggle password visibility
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password } = formData;
        try {
            await signup({ username, email, password });
            console.log("Signup successful");
        } catch (error) {
            console.error("Signup failed:", error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword
        });
    };

    return (
        <div className="container mx-auto max-w-md mt-8">
            <h2 className="text-2xl font-semibold mb-4">Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type={formData.showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute mt-6 inset-y-0 right-0 px-3 py-2"
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={formData.showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <button
                    className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
};
