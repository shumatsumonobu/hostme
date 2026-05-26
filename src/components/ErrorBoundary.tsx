"use client";

import { Component } from "react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-terminal-bg p-4">
          <div className="text-center">
            <p className="text-terminal-green text-lg mb-4">
              $ error --unexpected
            </p>
            <p className="text-terminal-green/60 text-sm mb-6">
              Something went wrong. Please reload the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="border border-terminal-green/50 text-terminal-green px-6 py-2 rounded font-mono text-sm hover:bg-terminal-green/10 transition-colors cursor-pointer"
            >
              [Enter] Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
