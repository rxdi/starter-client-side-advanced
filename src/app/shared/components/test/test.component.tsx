import * as React from "react";
import { Component, Injector } from "@rxdi/core";
import { HelloWorldService, HelloState, HelloProps } from "../../../core/services/hello-world.service";
import { Subscription } from "rxjs";
import shallowCompare from 'react-addons-shallow-compare';

@Component()
export class TestComponent extends React.Component<HelloProps, HelloState> {

  @Injector(HelloWorldService) private helloWorldService: HelloWorldService;

  subscription: Subscription;

  render() {
    return <div>
      <h1>Hello from {this.props.compiler}, {this.props.framework} and {this.props.rxdi}!</h1>
      <h1>Reactive Service Counter: {this.state && this.state.value}</h1>
    </div>
  }

  componentDidMount() {
    this.subscription = this.helloWorldService.state.subscribe(state => this.setState(state));
  }

  componentWillUnmount() {
    this.helloWorldService.clearInterval();
    this.subscription.unsubscribe();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

}