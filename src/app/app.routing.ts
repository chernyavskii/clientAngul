import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/index/login/login.component';
import {RegistrationComponent} from './components/index/registration/registration.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AuthGuard} from './utils/AuthGuard';
import {ProfileComponent} from './components/dashboard/profile/profile.component';
import {DocumentsComponent} from './components/dashboard/documents/documents.component';
import {AgentsComponent} from './components/dashboard/agents/agents.component';

const appRoutes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children:
      [
        {path: 'profile', component: ProfileComponent},
        {path: 'documents', component: DocumentsComponent},
        {path: 'agents', component: AgentsComponent}
      ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(appRoutes);
