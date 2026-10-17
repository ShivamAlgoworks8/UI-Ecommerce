/**
 * AuthContext — Authentication State Management
 * ─────────────────────────────────────────────
 * Provides global auth state using React Context.
 * Persists user data in localStorage so sessions
 * survive page refreshes.
 *
 * Exposes: user, login, signup, logout, isAuthenticated
 */

import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

/**
 * Custom hook to consume auth context.
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/**
 * AuthProvider — wraps the app and provides auth state.
 * Stores registered users in localStorage under "urbanova_users"
 * and the current session under "urbanova_current_user".
 */
export function AuthProvider({ children }) {
    // Initialize state from localStorage (persisted session)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("urbanova_current_user");
        return saved ? JSON.parse(saved) : null;
    });

    /**
     * getUsers — retrieves all registered users from localStorage.
     */
    const getUsers = () => {
        const users = localStorage.getItem("urbanova_users");
        return users ? JSON.parse(users) : [];
    };

    /**
     * signup — registers a new user.
     * Returns { success, message }
     */
    const signup = (name, email, password) => {
        const users = getUsers();

        // Check if email already registered
        const existing = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
            return { success: false, message: "An account with this email already exists." };
        }

        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password, // In production, NEVER store plain-text passwords
            createdAt: new Date().toISOString(),
        };

        // Save to "database"
        users.push(newUser);
        localStorage.setItem("urbanova_users", JSON.stringify(users));

        // Auto-login after signup
        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        setUser(sessionUser);
        localStorage.setItem("urbanova_current_user", JSON.stringify(sessionUser));

        return { success: true, message: "Account created successfully!" };
    };

    /**
     * login — authenticates a user with email & password.
     * Returns { success, message }
     */
    const login = (email, password) => {
        const users = getUsers();

        const found = users.find(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase().trim() &&
                u.password === password
        );

        if (!found) {
            return { success: false, message: "Invalid email or password." };
        }

        const sessionUser = { id: found.id, name: found.name, email: found.email };
        setUser(sessionUser);
        localStorage.setItem("urbanova_current_user", JSON.stringify(sessionUser));

        return { success: true, message: "Logged in successfully!" };
    };

    /**
     * logout — clears the current session.
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("urbanova_current_user");
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
