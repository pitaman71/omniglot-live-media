import React from 'react';

import { ErrorBoundary } from "react-error-boundary";

const Context = React.createContext<{
    log?: (text: string, id?: string) => JSX.Element
}>({});

export function Provide(props: React.PropsWithChildren<{
    log?: (text: string, id?: string) => JSX.Element
}>) {
    return <Context.Provider value={props}>{props.children}</Context.Provider>
}

export function Boundary(props: React.PropsWithChildren<{
    name: string,
    id?: string
}>) {
    const context = React.useContext(Context);
    return (
        <ErrorBoundary fallback={<div>Internal error: unable to render {props.name}</div>}>
            { context.log === undefined ? <React.Fragment></React.Fragment> : context.log(`BEGIN   ${props.name}`, props.id+'-begin') }
            <React.Fragment>{ props.children }</React.Fragment>
            { context.log === undefined ? <React.Fragment></React.Fragment> : context.log(`END     ${props.name}`, props.id+'-end') }
        </ErrorBoundary>
    )
}

export function Error(props: {
    message: string,
    id?: string
}) {
    const context = React.useContext(Context);
    return (
        context.log === undefined ? <React.Fragment></React.Fragment> : context.log(`ERROR   ${props.message}`)
    )
}
