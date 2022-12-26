import { delay, Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})

export class PromotionService {

  constructor() { }

  // getPromotions(): Promotion[] {
  //     return PROMOTIONS;
  // }

  // getPromotion(id: string): Promotion {
  //     return PROMOTIONS.filter((promo) => (promo.id === id))[0];
  // }

  // getFeaturedPromotion(): Promotion {
  //     return PROMOTIONS.filter((promotion) => promotion.featured)[0];
  // }


  getPromotions(): Observable<Promotion[]> {
    return of(PROMOTIONS).pipe(delay(2000));
  }

  getPromotion(id: string): Observable<Promotion> {
    return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(2000));
  }
}
