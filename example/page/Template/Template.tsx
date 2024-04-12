import React from "react";
import {useModuleState} from "../../useModuleState";
import {useLoadingStatus} from "../../../src";

export default function Example() {
    const loading = useLoadingStatus("abc");
    const {list} = useModuleState("Template");

    return (
        <div>
            {loading ? "loading" : null}
            {list.map(item => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}
