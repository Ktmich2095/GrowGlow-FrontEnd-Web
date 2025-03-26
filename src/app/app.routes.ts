import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      { path: 'dashboard', loadComponent: () => import('./business/dashboard/dashboard.component'), canActivate: [AuthGuard] },
      { path: 'profile', loadComponent: () => import('./business/profile/profile.component'), canActivate: [AuthGuard] },
      { path: 'tables', loadComponent: () => import('./business/tables/tables.component'), canActivate: [AuthGuard] },
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

  { path: '**', redirectTo: 'dashboard' }
];