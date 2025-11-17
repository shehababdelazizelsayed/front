import { Component, OnInit, OnDestroy } from '@angular/core';
import { Api } from '../../services/api';

interface HeroBook {
  Title: string;
  Subtitle?: string;
  Price?: string;
  Image: string;
}

@Component({
  selector: 'app-hero-sec',
  standalone: false,
  templateUrl: './hero-sec.html',
  styleUrl: './hero-sec.css',
})
export class HeroSec implements OnInit, OnDestroy {
  protected heroBooks: HeroBook[] = [];

  protected currentSlide = 0;
  private slideInterval: any;

  constructor(private api: Api) {}

  ngOnInit() {
    this.api.getHeroBooks().subscribe({
      next: (res) => {
        this.heroBooks = res.books || [];
        this.startSlideShow();
      },
      error: (err) => {
        console.error('Failed to load hero books', err);
        this.startSlideShow();
      },
    });
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
