import { Component, OnInit, OnDestroy } from '@angular/core';

interface HeroBook {
  title: string;
  subtitle: string;
  price: string;
  image: string;
}

@Component({
  selector: 'app-hero-sec',
  standalone: false,
  templateUrl: './hero-sec.html',
  styleUrl: './hero-sec.css',
})
export class HeroSec implements OnInit, OnDestroy {
  protected heroBooks: HeroBook[] = [
    {
      title: 'The Art of Programming',
      subtitle: 'A Comprehensive Guide to Software Development',
      price: '$49.99',
      image: '/assets/books/book1.jpg',
    },
    {
      title: 'Digital Dreams',
      subtitle: 'The Future of Technology',
      price: '$39.99',
      image: '/assets/books/book2.jpg',
    },
    {
      title: 'Web Development Mastery',
      subtitle: 'From Beginner to Professional',
      price: '$44.99',
      image: '/assets/books/book3.jpg',
    },
  ];

  protected currentSlide = 0;
  private slideInterval: any;

  ngOnInit() {
    this.startSlideShow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  protected nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroBooks.length;
  }

  protected prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.heroBooks.length) % this.heroBooks.length;
  }

  protected goToSlide(index: number) {
    this.currentSlide = index;
  }
}
