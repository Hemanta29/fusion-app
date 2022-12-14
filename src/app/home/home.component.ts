import { LeaderService } from './../services/leader.service';
import { Component, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [flyInOut(), expand()]
})
export class HomeComponent {
  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
  errMessageDish!: string;
  errMessagePromo!: string;
  errMessageLeader!: string;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL: string
  ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe({
      next: dish => this.dish = dish,
      error: errMessage => this.errMessageDish = <any>errMessage
    })
    this.promotionService.getFeaturedPromotion().subscribe({
      next: promotion => this.promotion = promotion,
      error: errMessage => this.errMessagePromo = <any>errMessage
    })
    this.leaderService.getFeaturedLeader().subscribe({
      next: leader => this.leader = leader,
      error: errMessage => this.errMessageLeader = <any>errMessage
    })
  }
}
