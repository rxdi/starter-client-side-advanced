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
        @Inject('ipfsDownloadedFactory') public ipfsDownloadedFactory: {testKey: () => string}
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