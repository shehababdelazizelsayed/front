import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ErrorInterceptor } from './interceptors/error-interceptor';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { BookCard } from './components/book-card/book-card';
import { Cat } from './components/cat/cat';
import { ErrorToastComponent } from './components/error-toast/error-toast.component';
import { Footer } from './components/footer/footer';
import { HeroSec } from './components/hero-sec/hero-sec';
import { Nav } from './components/nav/nav';
import { SuccessToastComponent } from './components/success-toast/success-toast.component';
import { Cart } from './page/cart/cart';
import { Category } from './page/category/category';
import { Forget } from './page/forget/forget';
import { HomeComponent } from './page/home/home';
import { Login } from './page/login/login';
import { Product } from './page/product/product';
import { Profile } from './page/profile/profile';
import { Register } from './page/register/register';
import { GlobalErrorHandler } from './services/global-error-handler';

@NgModule({
  declarations: [
    App,
    Nav,
    BookCard,
    HeroSec,
    HomeComponent,
    Category,
    Profile,
    Cart,
    Login,
    Cat,
    Footer,
    Register,
    Forget,
    Product,
    ErrorToastComponent,
    SuccessToastComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [App],
})
export class AppModule {}
