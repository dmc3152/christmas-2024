import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Observable, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-lyrics',
  imports: [MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './lyrics.component.html',
  styleUrl: './lyrics.component.scss'
})
export class LyricsComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
