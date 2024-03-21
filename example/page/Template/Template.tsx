import {useLoadingStatus} from "../../../src";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../type/state";
import {LOADING} from "./type";

export default function Example() {
    const loading = useLoadingStatus(LOADING);
    const {list} = useSelector((state: RootState) => state.app.Template);

    if (loading) return <div>loading...</div>;
    return (
        <div>
            {list.map(item => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}
