import { Leader } from './../shared/leader';
import { LeaderService } from './../services/leader.service';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
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
