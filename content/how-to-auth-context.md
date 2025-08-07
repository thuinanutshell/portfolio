# Building an Auth Context in React

**Date**: August 7, 2025

React's Context API makes it easy to share authentication state across your entire application. In this comprehensive tutorial, we'll build a robust auth system that handles login, logout, user persistence, and loading states.

## Why Use Context for Authentication?

Authentication state is needed throughout your app - in headers, protected routes, user profiles, and more. Instead of prop drilling or lifting state up through multiple components, Context provides a clean solution to share auth data globally.

## Step 1: Setup the Context

First, let's create our basic context structure:

```javascript
import { createContext } from "react";

export const AuthContext = createContext();
```

This creates an empty context that we'll populate with our auth provider.

## Step 2: Create the Auth Provider

Now we'll build the provider component that manages all authentication logic:

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { user: userData, token } = await response.json();

      localStorage.setItem("authToken", token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Helper function (you'd implement this based on your backend)
async function validateToken(token) {
  const response = await fetch("/api/auth/validate", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Token validation failed");
  }

  return response.json();
}
```

## Step 3: Wrap Your App

Add the provider to your main App component:

```jsx
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">{/* Your app content */}</div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Step 4: Using the Auth Context

### Login Component

```jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      // Redirect or show success message
      console.log("Login successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Protected Route Component

```jsx
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### Navigation Component

```jsx
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      <div className="nav-brand">My App</div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user.name}!</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </nav>
  );
}
```

## Advanced Features

### Auto-logout on Token Expiry

You can add automatic logout when tokens expire:

```jsx
// Add this to your AuthProvider
useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (token) {
    // Decode JWT to check expiry (you'd need jwt-decode package)
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
      }
    } catch (error) {
      logout();
    }
  }
}, []);
```

### Axios Interceptors

Automatically add auth headers to API requests:

```js
import axios from "axios";

// Request interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401s
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## Best Practices

1. **Error Handling**: Always handle errors gracefully and provide user feedback
2. **Loading States**: Show loading indicators during auth operations
3. **Token Storage**: Consider using httpOnly cookies instead of localStorage for enhanced security
4. **Validation**: Validate tokens on the client side before making API calls
5. **Cleanup**: Always cleanup event listeners and cancel pending requests

## Security Considerations

- Never store sensitive data in localStorage in production
- Implement proper CSRF protection
- Use HTTPS in production
- Consider implementing refresh token rotation
- Validate all inputs server-side

## Conclusion

React Context provides a clean, scalable way to manage authentication state. This pattern works well for small to medium applications, but consider more robust solutions like Redux or Zustand for complex auth flows.

The key benefits of this approach:

- **Centralized auth logic**: All authentication state in one place
- **Easy to test**: Auth logic is separated from components
- **Flexible**: Easy to extend with additional features
- **Type-safe**: Can be enhanced with TypeScript for better DX

Try implementing this pattern in your next React project!
