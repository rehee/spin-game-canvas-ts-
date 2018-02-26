import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomePage } from './pages/home-page/home-page';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './components/app/app.component'
const roots: Route[] = [
    {
        path: 'home', component: HomePage,

    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, HomePage],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(roots, { useHash: true }),
    ],
    entryComponents: [
        HomePage,
    ],
    providers: [
    ]
})
export class AppModule {
}
