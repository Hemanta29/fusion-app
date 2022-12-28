import { baseURL } from './../shared/baseurl';
import { Component, Inject, OnInit } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  dishes!: Dish[];


  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL: string
  ) { }

  ngOnInit(): void {
    // this.dishService.getDishes().then(dishes => this.dishes = dishes);
    this.dishService.getDishes().subscribe(dishes => this.dishes = dishes);
  }
}
