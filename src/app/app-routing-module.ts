import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home';
import { Category } from './page/category/category';
import { Profile } from './page/profile/profile';
import { Cart } from './page/cart/cart';
import { Login } from './page/login/login';
import { Register } from './page/register/register';
import { Forget } from './page/forget/forget';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'category', component: Category },
  { path: 'profile', component: Profile },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forget', component: Forget },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
