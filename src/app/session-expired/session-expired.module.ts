import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionExpiredRoutingModule } from './session-expired-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { SessionExpiredComponent } from './session-expired.component';


const routes: Routes = [
  { path: '', component: SessionExpiredComponent } 
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})

export class SessionExpiredModule { }
