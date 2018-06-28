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