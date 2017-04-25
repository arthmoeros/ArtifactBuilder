"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var generator_index_component_1 = require("./abgenerated/generator-index.component");
var sample_xml_arch_osb_alt_main_component_1 = require("./abgenerated/sample-xml-arch-osb-alt/sample-xml-arch-osb-alt-main.component");
var sample_form_one_alt_component_1 = require("./abgenerated/sample-xml-arch-osb-alt/sample-form-one-alt.component");
var gen_req_file_form_component_1 = require("./abgenerated/common-gen/gen-req-file-form.component");
var sample_xml_arch_osb_main_component_1 = require("./abgenerated/sample-xml-arch-osb/sample-xml-arch-osb-main.component");
var sample_form_one_component_1 = require("./abgenerated/sample-xml-arch-osb/sample-form-one.component");
var routes = [
    { path: '', redirectTo: '/generator-index', pathMatch: 'full' },
    { path: 'generator-index', component: generator_index_component_1.GeneratorIndexComponent },
    { path: 'sample-xml-arch-osb-alt', component: sample_xml_arch_osb_alt_main_component_1.SampleXMLArchOSBAltStub,
        children: [
            { path: 'sample-form-one-alt', component: sample_form_one_alt_component_1.SampleFormOneAltStub },
            { path: 'gen-req-file-form', component: gen_req_file_form_component_1.GenReqFileFormStub },
        ]
    },
    { path: 'sample-xml-arch-osb', component: sample_xml_arch_osb_main_component_1.SampleXMLArchOSBStub,
        children: [
            { path: 'sample-form-one', component: sample_form_one_component_1.SampleFormOneStub },
            { path: 'gen-req-file-form', component: gen_req_file_form_component_1.GenReqFileFormStub },
        ]
    },
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map