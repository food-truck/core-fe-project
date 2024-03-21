import React from "react";
import {async, SagaGenerator} from "../../../src";

const route = {
    name: "Template",
    menu: "Template",
    path: "Template",
    role: "ADMIN",
    icon: <div />,
    component: async(() => import("."), "Template"),
    children: [],
};
export default route;
