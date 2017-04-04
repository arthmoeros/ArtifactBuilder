"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var hero_1 = require("./hero");
var HeroFormComponent = (function () {
    function HeroFormComponent() {
        this.powers = [
            'Rashos laser',
            'Vision de carne',
            'Aliento poderoso',
            'Aliento frio'
        ];
        this.model = new hero_1.Hero(666, 'Super Pollo', this.powers[1], 'Juan Perez');
        this.submitted = false;
    }
    HeroFormComponent.prototype.onSubmit = function () {
        this.submitted = true;
    };
    Object.defineProperty(HeroFormComponent.prototype, "diagnostic", {
        get: function () {
            return JSON.stringify(this.model);
        },
        enumerable: true,
        configurable: true
    });
    HeroFormComponent.prototype.newHero = function () {
        this.model = new hero_1.Hero(42, '', '');
    };
    return HeroFormComponent;
}());
HeroFormComponent = __decorate([
    core_1.Component({
        selector: 'hero-form',
        templateUrl: './hero-form.component.html'
    })
], HeroFormComponent);
exports.HeroFormComponent = HeroFormComponent;
//# sourceMappingURL=hero-form.component.js.map