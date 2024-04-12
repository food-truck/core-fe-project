import React from "react";
import { useLoadingStatus } from "../../../src";
import { actions } from ".";
import { useModuleState } from "../../useModuleState";

export default function Example() {
    const { name } = useModuleState("Operation")
    const loading = useLoadingStatus("add");

    return (
        <div>
            <input type="text" value={name} onChange={e => actions.changeName(e.target.value)} />
            <button disabled={loading} onClick={actions.addItem}>Add</button>
        </div>
    );
}
