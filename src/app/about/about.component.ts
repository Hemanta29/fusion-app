import { Leader } from './../shared/leader';
import { LeaderService } from './../services/leader.service';
import { Component, Inject } from '@angular/core';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [flyInOut(), expand()]
})
export class AboutComponent {
  leaders: Leader[] = [];
  errMessage!: string;
  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL: string) { }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe({
      next: leaders => this.leaders = leaders,
      error: errMessage => this.errMessage = <any>errMessage
    });
  }
}
