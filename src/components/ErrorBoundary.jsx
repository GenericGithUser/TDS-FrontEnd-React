// src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorPage">
          <h2>Something went wrong.</h2>
          <h2 className="red">{this.state.error?.message}</h2>
          <button onClick={() => (window.location.href = "/login")}>
            Return to Login
          </button>
          <button type="button" onClick={()=> window.location.reload()}>
            Force Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
