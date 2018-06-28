
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, OnInit } from "@rxdi/core";
import { RouterComponent } from "./shared/components/router/router.component";

@Component()
export class AppComponent extends React.Component implements OnInit {

    OnInit() {
        ReactDOM.render(
            <AppComponent />,
            document.getElementById("App")
        );
        // setTimeout(() => ReactDOM.unmountComponentAtNode(document.getElementById('App')), 3000);
    }

    render() {
        return <RouterComponent/>;
    }

}