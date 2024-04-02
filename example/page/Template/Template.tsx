import React from "react";
import { useModuleState } from "../../useModuleState";

export default function Example() {
    const { list } = useModuleState("Template")

    return (
        <div>
            {list.map(item => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}
