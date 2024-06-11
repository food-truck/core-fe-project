import {app} from "../../../src/app";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useModuleState} from "../../useModuleState";
import {useLoadingStatus} from "../../../src";
import {actions} from ".";
import {Page as OperationPage} from "../Operation";

export default function Example() {
    const navigate = useNavigate();
    const loading = useLoadingStatus("abc");
    const {list, time} = useModuleState("Template");

    const onItemClick = (item: string, index: number) => {
        navigate(`/Template/${item}?index=${index}`);
    };

    const onRefetch = () => {
        actions.getTodoList();
    };

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <div>onTick: {time}</div>
            <OperationPage />
            {loading ? <button onClick={actions.cancelGetTodoList}>cancel loading</button> : <button onClick={onRefetch}>refetch</button>}
            <div>{loading ? "loading" : null}</div>
            {list.map((item, index) => (
                <div key={item} onClick={() => onItemClick(item, index)} style={{cursor: "pointer"}}>
                    {item}
                </div>
            ))}
        </div>
    );
}
