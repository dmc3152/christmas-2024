import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, map, Observable, of, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-buzzer',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './buzzer.component.html',
  styleUrl: './buzzer.component.scss',
  animations: [
    trigger('buttonState', [
      state('inactive', style({
        transform: 'scale(1)',
        backgroundColor: 'red'
      })),
      state('active', style({
        transform: 'scale(0.95)',
        backgroundColor: 'darkred'
      })),
      transition('inactive => active', animate('0.1s ease-in-out')),
      transition('active => inactive', animate('0.3s ease-in-out'))
    ])
  ]
})
export class BuzzerComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  name = new FormControl('', Validators.required);
  buttonState = 'inactive';

  nameIsInvalid = toSignal(this.name.statusChanges.pipe(
    map(status => status === 'INVALID'),
  ));
  // nameIsValid = toSignal(this.name.statusChanges.pipe(
  //   map(status => status === 'VALID'),
  //   debounceTime(500)
  // ))
  nameIsPresent = toSignal(
    this.name.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(name => !!name)
    )
  );
  isDisabled = computed(() => (this.nameIsInvalid() || !this.nameIsPresent()) ?? true);

  pressButton() {
    console.log('Button pressed!');
    this.buttonState = 'active';
  }

  releaseButton() {
    console.log('Button released!');
    this.buttonState = 'inactive';
  }
}
