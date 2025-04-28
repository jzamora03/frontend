import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { ApiService } from './core/api.service';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SessionExpiredComponent } from './session-expired/session-expired.component';



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    TaskFormComponent,
    RouterModule,
    SessionExpiredComponent

  ],
  providers: [ApiService, provideHttpClient(),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }