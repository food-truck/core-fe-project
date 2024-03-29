import React from "react";
import { Prompt } from "react-router";
import type { State } from "../sliceStores";

interface OwnProps {
    message: string;
    isPrevented: boolean;
}

interface Props extends OwnProps { }

class Component extends React.PureComponent<Props, State> {
    override componentDidUpdate(prevProps: Readonly<Props>): void {
        const { message, isPrevented } = this.props;
        if (prevProps.isPrevented !== isPrevented) {
            window.onbeforeunload = isPrevented ? () => message : null;
        }
    }

    override render() {
        const { isPrevented, message } = this.props;
        return <Prompt message={message} when={isPrevented} />;
    }
}

export const NavigationGuard = Component;
