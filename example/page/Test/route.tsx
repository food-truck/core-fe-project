import React from "react";
import {async} from "../../../src";

const route = {
    name: "Test",
    menu: "Test",
    path: "Test/:id?",
    role: "ADMIN",
    icon: <div />,
    Component: async(() => import("."), "Test"),
    children: [],
};
export default route;
