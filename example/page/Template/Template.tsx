import React from "react";
import { useModuleState } from "../../useModuleState";
import { useLoadingStatus } from "../../../src";
import { actions } from ".";
import { Page as OperationPage } from "../Operation"

export default function Example() {
    const loading = useLoadingStatus("abc");
    const { list } = useModuleState("Template");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <OperationPage />
            {loading ? <button onClick={actions.cancelGetTodoList}>cancel loading</button> : <button onClick={actions.getTodoList}>refetch</button>}
            <div>
                {loading ? "loading" : null}
            </div>
            {list.map(item => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}
