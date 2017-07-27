import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GeneratorIndexComponent } from './../generator-index/generator-index.component';
import { FormRendererComponent } from './../form-renderer/form-renderer.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  {
    path: 'index',
    component: GeneratorIndexComponent
  },
  {
    path: 'render-form/:id',
    component: FormRendererComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
