import React from "react";
import {async} from "../../../src";

const route = {
    name: "Template",
    menu: "Template",
    path: "Template/:id?",
    role: "ADMIN",
    icon: <div />,
    Component: async(() => import("."), "Template"),
    children: [],
};
export default route;
