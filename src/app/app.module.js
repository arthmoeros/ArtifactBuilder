"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var generator_index_component_1 = require("./abgenerated/generator-index.component");
var sample_xml_arch_osb_main_component_1 = require("./abgenerated/sample-xml-arch-osb/sample-xml-arch-osb-main.component");
var sample_form_one_component_1 = require("./abgenerated/sample-xml-arch-osb/sample-form-one.component");
var gen_req_file_form_component_1 = require("./abgenerated/sample-xml-arch-osb/gen-req-file-form.component");
var app_routing_module_1 = require("./app-routing.module");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            generator_index_component_1.GeneratorIndexComponent,
            sample_xml_arch_osb_main_component_1.SampleXMLArchOSBStub,
            sample_form_one_component_1.SampleFormOneStub,
            gen_req_file_form_component_1.GenReqFileFormStub,
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: []
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map