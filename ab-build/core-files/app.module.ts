import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component'
import { GeneratorIndexComponent } from './abgenerated/generator-index.component';
::NGCOMPONENTS_IMPORTS::
import { <!--component.className-->Stub } from './abgenerated/<!--folder.name-->/<!--component.name-->.component';
::/NGCOMPONENTS_IMPORTS::

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    GeneratorIndexComponent,
    ::NGCOMPONENTS_DECLARATION::
    <!--component.className-->Stub,
    ::/NGCOMPONENTS_DECLARATION::
  ],
  bootstrap: [AppComponent],
  providers: [
  ]
})


export class AppModule { }
