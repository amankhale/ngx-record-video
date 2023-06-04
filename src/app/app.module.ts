import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxRecordVideoModule } from 'projects/ngx-record-video/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxRecordVideoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
