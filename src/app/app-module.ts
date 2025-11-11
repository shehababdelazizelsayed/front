import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Nav } from './components/nav/nav';
import { BookCard } from './components/book-card/book-card';
import { HeroSec } from './components/hero-sec/hero-sec';
import { HomeComponent } from './page/home/home';
import { Category } from './page/category/category';
import { Login } from './page/login/login';
import { Cart } from './page/cart/cart';
import { Profile } from './page/profile/profile';
import { Cat } from './components/cat/cat';
import { Footer } from './components/footer/footer';
import { Register } from './page/register/register';
import { Forget } from './page/forget/forget';
import { provideHttpClient } from '@angular/common/http';
import { Product } from './page/product/product';

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
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule, RouterModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
