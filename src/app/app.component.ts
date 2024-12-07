import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _titleService = inject(Title);
  private _apollo = inject(Apollo);

  ngOnInit() {
    this._titleService.setTitle('EB2 Ward - Christmas 2024');

    if (!environment.production) {
      window.__APOLLO_CLIENT__ = this._apollo.client;
    }
  }
}
