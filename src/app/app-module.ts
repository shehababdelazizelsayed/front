import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ResponsePopupInterceptor } from './interceptors/response-popup.interceptor';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { BookCard } from './components/book-card/book-card';
import { Cat } from './components/cat/cat';
import { Footer } from './components/footer/footer';
import { HeroSec } from './components/hero-sec/hero-sec';
import { Nav } from './components/nav/nav';
import { Cart } from './page/cart/cart';
import { Category } from './page/category/category';
import { Forget } from './page/forget/forget';
import { HomeComponent } from './page/home/home';
import { Login } from './page/login/login';
import { Product } from './page/product/product';
import { Profile } from './page/profile/profile';
import { Register } from './page/register/register';
import { GlobalErrorHandler } from './services/global-error-handler';
import { Ai } from './components/ai/ai';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast } from 'bootstrap';
import { ToastrModule } from 'ngx-toastr';


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
    Ai,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ResponsePopupInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [App],
})
export class AppModule { }
