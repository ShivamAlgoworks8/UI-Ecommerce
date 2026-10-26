/**
 * AuthContext — Manages authentication state and backend API calls.
 * Exposes: user, login, signup, logout, isAuthenticated
 */

import { useCallback, useState } from "react";
import { AuthContext } from "./contextValue";

// Base URL of the Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api";

export function AuthProvider({ children }) {
    const saveSession = (data) => {
        const account = data.user || data.customer || data;
        const sessionUser = {
            id: account.id,
            name: account.name,
            email: account.email,
        };

        setUser(sessionUser);
        localStorage.setItem(
            "urbanova_current_user",
            JSON.stringify(sessionUser)
        );

        const token = data.token || data.accessToken;
        if (token) {
            localStorage.setItem("urbanova_token", token);
        }
    };

    const readResponse = async (response) => {
        const text = await response.text();

        if (!text) return {};

        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    };

    // Restore the current customer session when the application loads
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("urbanova_current_user");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            // Clear invalid session data to prevent JSON parsing errors
            localStorage.removeItem("urbanova_current_user");
            return null;
        }
    });

    /**
     * signup — registers a new customer through the backend API.
     * The backend validates the request, hashes the password,
     * saves the customer in MongoDB, and returns a JWT token.
     *
     * @param {string} name - Customer's full name
     * @param {string} email - Customer's email address
     * @param {string} password - Customer's password
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const signup = async (name, email, password) => {
        try {
            // Send the registration details to the Spring Boot backend
            const response = await fetch(
                `${API_BASE_URL}/auth/customer/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );

            // Read the response returned by the backend
            const data = await readResponse(response);

            // Return the backend error when registration is unsuccessful
            if (!response.ok) {
                return {
                    success: false,
                    message:
                        data.message ||
                        "Signup failed. Please check your details and try again.",
                };
            }

            saveSession(data);

            return {
                success: true,
                message: "Account created successfully!",
            };
        } catch (error) {
            // Handle network errors, such as an unavailable backend
            return {
                success: false,
                message:
                    error.message || "Unable to connect to the server. Please try again.",
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });
            const data = await readResponse(response);

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || "Login failed. Please check your details and try again.",
                };
            }

            saveSession(data);

            return {
                success: true,
                message: "Signed in successfully!",
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Unable to connect to the server. Please try again.",
            };
        }
    };

    /**
     * logout — clears the current browser session.
     * Does not modify the customer's Active/Inactive status in MongoDB.
     */
    const logout = useCallback(() => {
        // Clear the authenticated customer from application state
        setUser(null);

        // Remove the persisted customer session and JWT token
        localStorage.removeItem("urbanova_current_user");
        localStorage.removeItem("urbanova_token");
    }, [setUser]);

    // Values and functions available to components through AuthContext
    const value = {
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    // Provide authentication state and actions to the component tree
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
