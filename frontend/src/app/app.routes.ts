import { Routes } from '@angular/router';
import { RawMaterialList } from './components/raw-material-list/raw-material-list';
import { RawMaterialForm } from './components/raw-material-form/raw-material-form';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'raw-materials', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'raw-materials', component: RawMaterialList, canActivate: [authGuard] },
  { path: 'raw-materials/new', component: RawMaterialForm, canActivate: [authGuard] },
  { path: 'raw-materials/:id/edit', component: RawMaterialForm, canActivate: [authGuard] },
  { path: '**', redirectTo: 'raw-materials' },
];