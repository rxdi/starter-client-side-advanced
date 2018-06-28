import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

Bootstrap(AppModule, {
    init: false, // Since we don't want for web to initialize services, if we don't need this will prevent it
    initOptions: {
        services: true
    },
})
    .subscribe(
        () => console.log('App Started!'),
        (err) => console.error(err)
    );