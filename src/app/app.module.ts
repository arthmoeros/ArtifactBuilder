import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FormsModule }    from '@angular/forms';
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { GeneratorIndexComponent } from './generator-index/generator-index.component';
import { QSDTCoreService } from "./qsdt-core.service";
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { JsonIteratorPipe } from './json-iterator.pipe';
import { InputRendererComponent } from './input-renderer/input-renderer.component';
import { AppRoutingModule } from './app-routing/app-routing.module'

@NgModule({
  declarations: [
    AppComponent,
    GeneratorIndexComponent,
    FormRendererComponent,
    JsonIteratorPipe,
    InputRendererComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [QSDTCoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
