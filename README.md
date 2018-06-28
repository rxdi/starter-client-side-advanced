# @rxdi/starter-client-side-advanced
## Starter project with React and Incremental DOM based on @rxdi/core
## Powerful Dependency Injection inside Browser and Node using Typescript and RXJS 6
***
> The idea behind [@rxdi](https://github.com/rxdi) is to create independent, dependency injection that can be used everywhere,
> Node and Browser with purpose also to share the same code without chainging nothing!
> First steps where with platform called [@gapi](https://github.com/Stradivario/gapi) you can check repository [@gapi/core](https://github.com/Stradivario/gapi-core).
> Then because of the needs of the platform i decided to develop this Reactive Dependency Injection container helping me build progressive applications.
> Hope you like my journey!
> Any help and suggestions are appreciated!
Main repository [@rxdi/core](https://github.com/rxdi/core) 
***
### Installation and basic examples:

##### To start developing, run:

```bash
git clone https://github.com/rxdi/starter-client-side-advanced
```
##### Install modules:

```bash
npm install
```
##### Running App

For starting and building application we will use Parcel a new configuration-less web bundler [ParcelJS](https://parceljs.org/)

This project is with added ReactJS and when builded for production bundle is less than 800Kb!!

To install parcel type:

```bash
npm install -g parcel-bundler
```

##### Start App
```bash
parcel ./src/index.html --target browser
```

##### Build App
```bash
parcel build ./src/index.html --target browser
```

## Simplest app


#### Main starting point

src/main.ts
```typescript
import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

Bootstrap(AppModule, {
    init: false,
    initOptions: {
        services: true,
    },
    logger: {
        logging: true,
        date: true,
        hashes: true,
        exitHandler: true,
        fileService: true
    }
})
.subscribe(
    () => console.log('Started!'),
    (e) => console.error(e)
);
```

#### App Module

src/app/app.module.ts

```typescript
import { Module } from "@rxdi/core";
import { CoreModule } from './core/core.module';
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";

@Module({
    imports: [
        CoreModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```


#### App Component
src/app/app.component.tsx

```typescript
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
    }

    render() {
        return <RouterComponent />;
    }

}
```

#### Shared Module
src/app/shared/shared.module.ts

```typescript
import { Module } from "@rxdi/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TestComponent } from "./components/test/test.component";
import { RouterComponent } from "./components/router/router.component";

@Module({
    components: [
        DashboardComponent,
        RouterComponent,
        TestComponent
    ]
})
export class SharedModule { }
```


#### Dashboard Component

src/app/shared/components/dashboard/dashboard.component.tsx
```typescript
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
          <span className="label">From: {this.helloWorldService.count} </span>
          <span className="value">{this.renderer.ipfsDownloadedFactory.testKey()}</span>
        </div>
        <div className="status">
          <span className="label">Status: </span>
          <span className="value"> Unread</span>
        </div>
        <div className="message">
          <span className="label">Message: </span>
          <span className="value">Have a great day!</span>
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

```

#### Router Component
src/app/shared/components/router/router.component.tsx

```typescript
import * as React from "react";
import { Component, OnInit } from "@rxdi/core";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { TestComponent } from "../test/test.component";

@Component()
export class RouterComponent extends React.Component implements OnInit {

    OnInit() { }

    render() {
        return <div>
            <DashboardComponent />
            <TestComponent compiler="TypeScript" framework="React" rxdi="@rxdi" />
        </div>
    }

}
```

#### Test Component
src/app/shared/test/test.component.tsx

```typescript
import * as React from "react";
import { Component, OnInit, Injector } from "@rxdi/core";
import { HelloWorldService, HelloState, HelloProps } from "../../../core/services/hello-world.service";
import { Subscription } from "rxjs";
import shallowCompare from 'react-addons-shallow-compare';

@Component()
export class TestComponent extends React.Component<HelloProps, HelloState> implements OnInit {

  private helloWorldService: HelloWorldService = InjectSoft(HelloWorldService);

  subscription: Subscription;

  OnInit() { }

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

```

#### Core module
src/app/core/core.module.ts

```typescript
import { Module } from "@rxdi/core";
import { RendererService } from "./services/renderer";
import { HelloWorldService } from "./services/hello-world.service";

@Module({
    services: [
        RendererService,
        HelloWorldService,
        {
            provide: 'ipfsDownloadedFactory',
            useDynamic: {
                link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
            }
        }
    ]
})
export class CoreModule { }
```

#### Hello World Service
src/app/core/services/hello-world.service.ts

```typescript

import { Service } from "@rxdi/core";
import { BehaviorSubject } from "rxjs";

export class HelloState {
    value?: number = 0;
}

export class HelloProps {
    compiler?: string;
    framework?: string;
    rxdi?: string;
}

@Service()
export class HelloWorldService {
    count: number = 0;
    state: BehaviorSubject<HelloState> = new BehaviorSubject(new HelloState());
    interval: any;

    constructor() {
        this.interval = setInterval(() => {

            this.count++
            // Stop changing state when count reaches 6
            if (this.count <= 6) {
                this.state.next({ value: this.count });
            }

            console.log(this);
            // Until count is 10 no DOM manipulations will be triggered
            // Start changing state when count reaches 10
            if (this.count >= 10) {
                this.state.next({ value: this.count });
            }
        }, 1000);
    }

    clearInterval() {
        clearInterval(this.interval);
    }

}

```



#### Renderer service

Renderer example is not related with example above, just different use case for [@rxdi/core](https://github.com/rxdi/core).

It can be used for creating low level library where you can build your own Incremental DOM

More information can be found here: [IDOM](https://github.com/google/incremental-dom)

src/app/core/services/renderer.ts

```typescript
import { Service, Inject } from "@rxdi/core";

export class NodeData {
    text: string;
    name: string;
    constructor(name) {
        this.name = name;
        this.text = null;
    }
}

@Service({ init: true })
export class RendererService {
    constructor(
        @Inject('ipfsDownloadedFactory') private ipfsDownloadedFactory: {testKey: () => string}
    ) {
        console.log("My awesome app!");
        const NODE_DATA_KEY = '__ID_Data__';

        // The current nodes being processed
        let currentNode = null;
        let currentParent = null;

        function getData(node) {
            if (!node[NODE_DATA_KEY]) {
                node[NODE_DATA_KEY] = new NodeData(node.nodeName.toLowerCase());
            }

            return node[NODE_DATA_KEY];
        }

        function enterNode() {
            currentParent = currentNode;
            currentNode = null;
        }

        function nextNode() {
            currentNode = currentNode ? currentNode.nextSibling : currentParent.firstChild;
        }

        function exitNode() {
            currentNode = currentParent;
            currentParent = currentParent.parentNode;
        }

        const matches = function (matchNode, name/*, key */) {
            const data = getData(matchNode);
            return name === data.name // && key === data.key;
        };

        function renderDOM(name) {
            if (currentNode && matches(currentNode, name/*, key */)) {
                return currentNode;
            }

            const node = name === '#text' ?
                document.createTextNode('') :
                document.createElement(name);

            currentParent.insertBefore(node, currentNode);

            currentNode = node;

            return node;
        }

        function elementOpen(name) {
            nextNode();
            const node = renderDOM(name);
            enterNode();

            // check for updates, i.t attributes
            const data = getData(node);
            return currentParent;
        }

        function elementClose(node) {
            exitNode();

            return currentNode;
        }

        function text(value) {
            nextNode();
            const node = renderDOM('#text');

            // checks for text updates
            const data = getData(node);

            if (data.text !== value) {
                data.text = (value);
                node.data = value;
            }

            return currentNode;
        }


        function patch(node, fn, data) {
            currentNode = node;

            enterNode();
            fn(data);
            exitNode();
        };


        function render(data) {
            elementOpen('h1');
            {
                text('Hello from, ' + data.user)
                text('\n and ' + data.ipfs)
            }
            elementClose('h1');
            elementOpen('ul')
            {
                elementOpen('li');
                {
                    text('Counter: ')
                    elementOpen('span');
                    {
                        text(data.counter);
                    }
                    elementClose('span');
                }
                elementClose('li');
            }

            elementClose('ul');
        }

        const element = document.getElementById('renderer');

        document.querySelector('button').addEventListener('click', () => {
            data.counter++;
            patch(element, render, data);
        });
        document.querySelector('input').addEventListener('input', (e) => {
            data.user = e.target['value'];
            console.log(data);

            patch(element, render, data);
        });

        const data = {
            user: `@rxdi and IDOM`,
            ipfs: `result from ipfs dynamic factory '${this.ipfsDownloadedFactory.testKey()}'`,
            counter: 1
        };

        patch(element, render, data);
    }
}
```



#### Notes

`InjectSoft` - Function is added due to problem when extending `React.Component` class.

Dependencies are not resolved and extended correctly by React.Component class.This is temporary solution for injecting Services when constructor is intialized and setting properties to correct constructor.

Except `@Component()` when extending `React.Component` all other decorators work as expected depending inside constructor.

When using NodeJS reamains unchanged

Later releases will be created separated class extending react and will be inside othe repository `@rxdi/reactive-components`
Can be extended as follow

```typescript
import { Component } from "@rxdi/core";
import { ReactComponent } from "@rxdi/reactive-components";
import { ReactiveService } from "../components/react.service";

@Component()
export class AppComponent extends ReactComponent<any, any> {

    // private reactiveService: ReactiveService = InjectSoft(ReactiveService); older version

    constructor(
        private reactiveService: ReactiveService
    ) {
        super();
    }

}
```
