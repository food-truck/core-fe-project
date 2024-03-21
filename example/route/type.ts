import {ComponentType, ReactElement} from "react";

export interface FTIRoute {
    name: string;
    path: string;
    menu?: string;
    icon?: React.ReactNode;
    role: string | null;
    component?: ComponentType<any>;
    children?: FTIRoute[];
    hidden?: boolean;
    customBreadCrumbs?: React.ReactElement;
    badge?: React.ReactNode;
}
