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

@NgModule({
  declarations: [App, Nav, BookCard, HeroSec, HomeComponent, Category, Profile, Cart, Login],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule, RouterModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
