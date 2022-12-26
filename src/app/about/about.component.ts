import { Leader } from './../shared/leader';
import { LeaderService } from './../services/leader.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  leaders: Leader[] = [];
  constructor(private leaderService: LeaderService) { }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders);
  }
}
