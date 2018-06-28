# @rxdi/starter-client-side
## Starter project with React and Incremental DOM based on @rxdi/core
## Powerful Dependency Injection inside Browser and Node using Typescript and RXJS 6
***
> The idea behind [@rxdi](https://github.com/rxdi) is to create independent, dependency injection that can be used everywhere.
> First steps where with platform called [@gapi](https://github.com/Stradivario/gapi) you can check repository [@gapi/core](https://github.com/Stradivario/gapi-core).
> Then because of the needs of the platform i decided to develop this Reactive Dependency Injection container helping me build progressive applications.
> Hope you like my journey!
> Any help and suggestions are appreciated!
Main repository [@rxdi/core](https://github.com/rxdi/core) 
***
### Installation and basic examples:

##### To start developing, run:

```bash
git clone https://github.com/rxdi/starter-client-side
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
    init: true,
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
import { RenderService } from './render.service.ts';
import { ReactModule } from "./react/react.module";

@Module({
    imports: [ReactModule],
    services: [RenderService]
})
export class AppModule {}
```


#### React Module
You can import `ReactComponent` directly inside `AppModule` but for good architecture purpose we need to create related module.

src/app/react/react.module.ts

```typescript
import { Module } from "@rxdi/core";
import { ReactComponent } from "./components/react.component";
import { ReactiveService } from "./components/react.service";

@Module({
    components: [ReactComponent],
    services: [ReactiveService]
})
export class ReactModule {}
```

#### React Component
src/app/react/components/react.component.tsx

```typescript

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, OnInit, Injector } from "@rxdi/core";
import shallowCompare from 'react-addons-shallow-compare';
import { ReactiveService } from "../components/react.service";
import { Subscription } from "rxjs";
import { HelloProps, HelloState } from "./react.component.model";

@Component()
export class ReactComponent extends React.Component<HelloProps, HelloState> implements OnInit {

    @Injector(ReactiveService) private reactiveService: ReactiveService;

    subscription: Subscription;

    OnInit() {
        ReactDOM.render(
            <ReactComponent compiler="TypeScript" framework="React" rxdi="@rxdi" />,
            document.getElementById("App")
        );
    }

    render() {
        return <div>
            <h1>Hello from {this.props.compiler}, {this.props.framework} and {this.props.rxdi}!</h1>
            <h1>Reactive Service Counter: {this.state && this.state.value}</h1>
        </div>;
    }

    componentDidMount() {
        this.subscription = this.reactiveService.state.subscribe(state => this.setState(state));
    }

    componentWillUnmount() {
        this.reactiveService.clearInterval();
        this.subscription.unsubscribe();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

}
```


#### React State


```typescript
export class HelloProps {
    compiler: string;
    framework: string;
    rxdi: string;
}

export class HelloState {
    value: number;
}

```

#### Reactive Service
```typescript

import { Service } from "@rxdi/core";
import { BehaviorSubject } from "rxjs";
import { HelloState } from "./react.component.model";

@Service()
export class ReactiveService {
    count: number = 0;
    state: BehaviorSubject<HelloState> = new BehaviorSubject({value: 0});
    interval: any;

    constructor() {
        this.interval = setInterval(() => {

            this.count++
            // Stop changing state when count reaches 6
            if (this.count <= 6) {
                this.state.next({ value: this.count });
            }

            console.log(this);
            // Until count is 15 no DOM manipulations will be triggered
            // Start changing state when count reaches 15
            if (this.count > 10) {
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

import { Service } from "@rxdi/core";

export class NodeData {
    text: string;
    name: string;
    constructor(name) {
        this.name = name;
        this.text = null;
    }
}

@Service()
export class RendererService {
    constructor(

    ) {
        alert("My awesome app!");
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
                text('Hello, ' + data.user)
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


        document.querySelector('button').addEventListener('click', () => {
            data.counter++;
            patch(document.body, render, data);
        });
        document.querySelector('input').addEventListener('input', (e) => {
            data.user = e.target['value'];
            patch(document.body, render, data);
        });

        const data = {
            user: 'Alexey',
            counter: 1
        };

        patch(document.body, render, data);
    }
}

```