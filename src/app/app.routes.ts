import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./business/dashboard/dashboard.component').then(m =>m.DashboardComponent),data: { breadcrumb: 'Dashboard' }},
      { path: 'descripcion', loadComponent: () => import('./business/descripcion/descripcion.component').then(m => m.DescripcionComponent),data: { breadcrumb: 'Descripción' } },
      { path: 'logros', loadComponent: () => import('./business/logros/logros.component').then(m => m.LogrosComponent),data: { breadcrumb: 'Mis Logros' } },
      {path:'perfil',loadComponent:()=>import ('./business/profile/profile.component').then(m => m.ProfileComponent)},
      {path:'configuracion',loadComponent:()=>import ('./business/settings/settings.component').then(m => m.SettingsComponent)},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./business/authentication/login/login.component'),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./business/authentication/register/register.component').then(m => m.RegisterComponent),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./business/authentication/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./business/authentication/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
