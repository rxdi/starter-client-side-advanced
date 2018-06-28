import * as React from "react";
import { Component, InjectSoft } from "@rxdi/core";
import { HelloWorldService } from "../../../core/services/hello-world.service";
import { Subscription } from "rxjs";
import { RendererService } from "../../../core/services/renderer";

@Component()
export class DashboardComponent extends React.Component {

  private renderer: RendererService = InjectSoft(RendererService);
  private helloWorldService: HelloWorldService = InjectSoft(HelloWorldService);
  private subscription: Subscription;

  render() {
    return (
      <div className="container">
        <div className="from">
          <span className="label">Counter : {this.helloWorldService.count} </span>
        </div>
        <div className="status">
          <span className="label">Ipfs factory: </span>
          <span className="value"> {this.renderer.ipfsDownloadedFactory.testKey()}</span>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.subscription = this.helloWorldService.state.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

}


