import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, EMPTY, map, Observable, shareReplay, Subscription, take } from 'rxjs';
import { AddToScoreboardGQL, BuzzerAvailabilityGQL, BuzzerAvailabilitySubscription, GetUnauthenticatedSelfGQL, MyScoreStateGQL, MyScoreStateSubscription, PressBuzzerGQL } from '../../../graphql/generated';
import { Howl } from 'howler';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-buzzer',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  providers: [Document],
  templateUrl: './buzzer.component.html',
  styleUrl: './buzzer.component.scss',
})
export class BuzzerComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private getUnauthenticatedSelf = inject(GetUnauthenticatedSelfGQL);
  private buzzerAvailabilityQuery = inject(BuzzerAvailabilityGQL);
  private pressBuzzerMutation = inject(PressBuzzerGQL);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private addToScoreboardMutation = inject(AddToScoreboardGQL);
  private myScoreStateGql = inject(MyScoreStateGQL);

  private _buzzerSubscription?: Subscription;
  private _scoreSubscription?: Subscription;
  private _soundLibrary = [
    'sounds/bell.mp3',
    'sounds/carol-of-the-bells.mp3',
    'sounds/choir.mp3',
    'sounds/christmas-logo.mp3',
    'sounds/holiday-song.mp3',
    'sounds/loop-song.mp3',
    'sounds/pop.mp3',
    'sounds/twinkle-charm.mp3',
  ];
  private _usedSounds: string[] = [];
  private _sound?: Howl;

  buzzerSubscription = signal<Observable<number | undefined>>(EMPTY);
  buzzerAvailability = signal<BuzzerAvailabilitySubscription['buzzerAvailability']>({ isAvailable: false, isPressed: false });
  myScore = signal<MyScoreStateSubscription['myScore']>({ onScoreboard: false });


  isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required)
  })

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

  isDisabled = computed(() => !this.buzzerAvailability().isAvailable);
  buzzerText = computed(() => {
    if (!this.userName() || !this.buzzerCode()) return 'Please enter the game code';
    return this.isDisabled() ? 'Buzzer is locked' : 'Press Me';
  })
  isSoundPlaying = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.userName() || !this.buzzerCode()) {
        this._closeBuzzerSubscription();
        this._closeScoreSubscription();
        this.buzzerAvailability.set({ isAvailable: false, isPressed: false });
        this.myScore.set({ onScoreboard: false });
        return;
      }

      this._closeBuzzerSubscription();
      this._closeScoreSubscription();
      const code = this.formGroup.controls.code.value;
      if (!code) return;

      this._buzzerSubscription = this.buzzerAvailabilityQuery.subscribe({ code }).pipe(map(result => result.data?.buzzerAvailability))
        .subscribe(buzzerAvailability => {
          this.buzzerAvailability.set(buzzerAvailability || { isAvailable: false, isPressed: false });
        });
      
      this._scoreSubscription = this.myScoreStateGql.subscribe({ code }).pipe(map(result => result.data?.myScore))
        .subscribe(myScore => {
          this.myScore.set(myScore || { onScoreboard: false });
        });
    });

    effect(() => {
      const name = this.initialName();
      if (name) {
        this.formGroup.controls.name.setValue(name);
        this.cdr.detectChanges();
      }
    });

    this.loadSound();
  }

  initialName = toSignal(this.getUnauthenticatedSelf.fetch().pipe(map(result => result.data?.unauthenticatedSelf?.name)));

  ngOnDestroy() {
    this._closeBuzzerSubscription();
    this._closeScoreSubscription();
  }

  loadSound = () => {
    if (this._sound) {
      this._sound.unload();
    }

    const file = this._getRandomSound([...this._soundLibrary]);
    this._sound = new Howl({
      src: [file],
      html5: true,
      loop: true
    });

    this._sound.on('playerror', () => {
      this._sound?.once('unlock', () => {
        this._sound?.play();
      });
    });
  }

  private _getRandomSound = (sounds: string[]): string => {
    if (this._usedSounds.length === this._soundLibrary.length) {
      this._usedSounds = [];
    }

    const randomSrcIndex = Math.floor(Math.random() * sounds.length);
    if (this._usedSounds.includes(sounds[randomSrcIndex])) {
      sounds.splice(randomSrcIndex, 1);
      return this._getRandomSound(sounds);
    }

    this._usedSounds.push(sounds[randomSrcIndex]);
    return sounds[randomSrcIndex];
  }

  private _closeBuzzerSubscription() {
    if (this._buzzerSubscription) {
      this._buzzerSubscription.unsubscribe();
    }
  }

  private _closeScoreSubscription() {
    if (this._scoreSubscription) {
      this._scoreSubscription.unsubscribe();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      data: { name: this.formGroup.controls.name.value },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.formGroup.controls.name.patchValue(result);
        this.cdr.detectChanges();
      }
    });
  }

  pressButton() {
    if (this.isDisabled()) return;
    if (this._sound?.playing()) return;
    
    this._sound?.play();
    this.isSoundPlaying.set(this._sound?.playing() || false);

    const code = this.buzzerCode();
    const isAlreadyPressed = this.buzzerAvailability().isPressed;
    if (!isAlreadyPressed && code) {
      this._sendPress(code);
    }

    if (!this.myScore().onScoreboard && code) {
      this._addToScoreboard(code);
    }
  }

  private _addToScoreboard = (code: string) => {
    this.addToScoreboardMutation
      .mutate({ code })
      .pipe(take(1))
      .subscribe(result => {
        if (!result.data?.addToScoreboard) {
          console.error('Failed to add to scoreboard');
        }
      });
  }

  private _sendPress = (code: string) => {
    this.pressBuzzerMutation
      .mutate({ code })
      .pipe(take(1))
      .subscribe(result => {
        if (!result.data?.pressBuzzer) {
          console.error('Failed to press buzzer');
        }
      });
  }

  releaseButton() {
    this._sound?.stop();
    this.isSoundPlaying.set(false);
  }

  stopSound() {
    this._sound?.stop();
    this.isSoundPlaying.set(false);
  }
}
