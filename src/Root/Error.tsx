/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface Props {
    children: any;
}

interface State {
    error: Error | null;
    errorInfo: any;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: unknown) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    <h2>Something went wrong. Please report this to admins</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.error.stack}
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
