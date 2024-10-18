import React, { ErrorInfo, ReactNode } from "react";

import { LoggerService } from "@services";
import { ErrorBoundaryBlock } from "@components/errorBoundaryBlock";
import { MainLayout } from "@/layouts/MainLayout";
import { Router, withRouter } from "next/router";

interface ErrorBoundaryProps {
  children: ReactNode;
  router: Router;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorText: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorText: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorText: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    LoggerService.error(error, errorInfo);
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>): void {
    if (prevProps.router.pathname !== this.props.router.pathname) {
      this.setState({ ...this.state, hasError: false, errorText: "" });
    }
  }

  render() {
    const { hasError, errorText } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <MainLayout
          Component={ErrorBoundaryBlock}
          props={{ errorText: errorText }}
          isLoading={false}
        />
      );
    }

    return children;
  }
}

export default withRouter(ErrorBoundary);
