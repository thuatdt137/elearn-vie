// ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Navigate to="/signin" replace />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;