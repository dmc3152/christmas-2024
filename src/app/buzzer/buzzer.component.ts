import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, firstValueFrom, map, Observable, shareReplay, Subscription, take } from 'rxjs';
import { BuzzerAvailabilityGQL, BuzzerAvailabilitySubscription, GetUnauthenticatedSelfGQL, SignInAsUnauthenticatedUserGQL, SignInAsUnauthenticatedUserMutationVariables, SubscriptionGQL } from '../../../graphql/generated';

@Component({
  selector: 'app-buzzer',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  providers: [Document],
  templateUrl: './buzzer.component.html',
  styleUrl: './buzzer.component.scss',
})
export class BuzzerComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private _document = inject(Document);
  private signInAsUnauthenticatedUser = inject(SignInAsUnauthenticatedUserGQL);
  private getUnauthenticatedSelf = inject(GetUnauthenticatedSelfGQL);
  private buzzerAvailabilityQuery = inject(BuzzerAvailabilityGQL);

  private _buzzerSubscription?: Subscription;

  constructor() {
    effect(async () => {
      if (!this.userName() || !this.formGroup.controls.name.value) return;

      console.log('cookies', this._document.cookie);
      const variables: SignInAsUnauthenticatedUserMutationVariables = {
        name: this.formGroup.controls.name.value
      };
      const user = await firstValueFrom(
        this.signInAsUnauthenticatedUser
          .mutate(variables)
          .pipe(
            catchError(err => {
              console.error(err);
              return EMPTY;
            })
          )
      );
      console.log('user', user);
    });

    effect(() => {
      if (!this.userName() || !this.buzzerCode()) {
        this._closeBuzzerSubscription();
        this.buzzerAvailability.set({ isAvailable: false, reason: ['Enter your name and code'] });
        return;
      }

      this._closeBuzzerSubscription();
      const code = this.formGroup.controls.code.value;
      if (!code) return;
      this._buzzerSubscription = this.buzzerAvailabilityQuery.subscribe({ code }).pipe(map(result => result.data?.buzzerAvailability))
        .subscribe(buzzerAvailability => {
          this.buzzerAvailability.set(buzzerAvailability || { isAvailable: false });
        });
    });
  }

  ngOnInit() {
    this.getUnauthenticatedSelf.fetch().pipe(take(1)).subscribe(result => {
      if (result.data.unauthenticatedSelf?.name) {
        this.formGroup.controls.name.patchValue(result.data.unauthenticatedSelf.name);
      }
    });
  }

  ngOnDestroy() {
    this._closeBuzzerSubscription();
  }

  private _closeBuzzerSubscription() {
    if (this._buzzerSubscription) {
      this._buzzerSubscription.unsubscribe();
    }
  }

  buzzerSubscription = signal<Observable<number | undefined>>(EMPTY);
  buzzerAvailability = signal<BuzzerAvailabilitySubscription['buzzerAvailability']>({isAvailable: false});

  isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required)
  })
  buttonState = 'inactive';

  formIsInvalid = toSignal(this.formGroup.statusChanges.pipe(
    map(status => status === 'INVALID'),
  ));

  buzzerCode = toSignal(this.formGroup.controls.code.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ));

  userName = toSignal(this.formGroup.controls.name.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ));

  nameIsPresent = computed(() => !!this.userName());
  codeIsPresent = computed(() => !!this.buzzerCode());
  isDisabled = computed(() => !this.buzzerAvailability().isAvailable);

  buzzerSession = computed(() => {
    if (!this.nameIsPresent() || !this.codeIsPresent()) return null;


    return null;
  })

  pressButton() {
    console.log('Button pressed!');
    this.buttonState = 'active';
  }

  releaseButton() {
    console.log('Button released!');
    this.buttonState = 'inactive';
  }
}
