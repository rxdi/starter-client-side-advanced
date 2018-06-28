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