import * as React from "react";
import { Component } from "@rxdi/core";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { TestComponent } from "../test/test.component";
import { FocusInput } from "../focus-input/focus-input.component";

@Component()
export class RouterComponent extends React.Component<any, any> {
    render() {
        return (
            <>
                <DashboardComponent />
                <TestComponent compiler="" test={DashboardComponent} framework="React" rxdi="@rxdi" />
                <FocusInput />
            </>
        )
    }

}