import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component'
import { GeneratorIndexComponent } from './abgenerated/generator-index.component';

import { SampleXMLArchOSBAltStub } from './abgenerated/sample-xml-arch-osb-alt/sample-xml-arch-osb-alt-main.component';

import { SampleFormOneAltStub } from './abgenerated/sample-xml-arch-osb-alt/sample-form-one-alt.component';

import { GenReqFileFormStub } from './abgenerated/common-gen/gen-req-file-form.component';

import { SampleXMLArchOSBStub } from './abgenerated/sample-xml-arch-osb/sample-xml-arch-osb-main.component';

import { SampleFormOneStub } from './abgenerated/sample-xml-arch-osb/sample-form-one.component';


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
    
    SampleXMLArchOSBAltStub,
    
    SampleFormOneAltStub,
    
    GenReqFileFormStub,
    
    SampleXMLArchOSBStub,
    
    SampleFormOneStub,
    
  ],
  bootstrap: [AppComponent],
  providers: [
  ]
})


export class AppModule { }
