import { baseURL } from './../shared/baseurl';
import { Component, Inject, OnInit } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [flyInOut(), expand()]
})

export class MenuComponent implements OnInit {
  dishes!: Dish[];
  errMessage!: string;

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL: string
  ) { }

  ngOnInit(): void {
    // this.dishService.getDishes().then(dishes => this.dishes = dishes);
    this.dishService.getDishes().subscribe({
      next: (dishes) => this.dishes = dishes,
      error: (errMessage) => this.errMessage = <any>errMessage
    })
  }
}
