import { Module } from "@rxdi/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TestComponent } from "./components/test/test.component";
import { RouterComponent } from "./components/router/router.component";
import { FocusInput } from "./components/focus-input/focus-input.component";

@Module({
    components: [
        RouterComponent,
        TestComponent,
        FocusInput,
        DashboardComponent
    ]
})
export class SharedModule { }