import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CanvasComponent} from './canvas/canvas.component';
import {FormsModule} from '@angular/forms';
import {TimestampPipe} from './timestamp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    TimestampPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [TimestampPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
