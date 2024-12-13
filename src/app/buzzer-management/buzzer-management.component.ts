import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { firstValueFrom, map, Subscription, take } from 'rxjs';
import { BuzzerPress, BuzzerPressesGQL, ClearAllBuzzerPressesGQL, ClearSelectedBuzzerPressesGQL, CreateBuzzerGQL, DecreaseScoreGQL, IncreaseScoreGQL, LiveScoreboardGQL, LockBuzzerGQL, MyBuzzerDocument, MyBuzzerGQL, RemoveFromScoreboardGQL, Score, UnlockBuzzerGQL, UpdateBuzzerCodeGQL } from '../../../graphql/generated';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type BuzzerPressWithTime = BuzzerPress & {
  time: string
}

@Component({
  selector: 'app-buzzer-management',
  imports: [MatCardModule, MatButtonModule, MatListModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './buzzer-management.component.html',
  styleUrl: './buzzer-management.component.scss'
})
export class BuzzerManagementComponent {
  private buzzerPressesGql = inject(BuzzerPressesGQL);
  private myBuzzerGql = inject(MyBuzzerGQL);
  private createBuzzerGql = inject(CreateBuzzerGQL);
  private updateBuzzerCodeGql = inject(UpdateBuzzerCodeGQL);
  private lockBuzzerGql = inject(LockBuzzerGQL);
  private unlockBuzzerGql = inject(UnlockBuzzerGQL);
  private clearSelectedBuzzerPressesGql = inject(ClearSelectedBuzzerPressesGQL);
  private clearAllBuzzerPressesGql = inject(ClearAllBuzzerPressesGQL);
  private scoreboardGql = inject(LiveScoreboardGQL);
  private increaseScoreGql = inject(IncreaseScoreGQL);
  private decreaseScoreGql = inject(DecreaseScoreGQL);
  private removeFromScoreboardGql = inject(RemoveFromScoreboardGQL);

  form: FormGroup;
  buzzerPresses = signal<BuzzerPressWithTime[]>([]);
  buzzerPressesControl = new FormControl<string[]>([]);
  isClearSelectedEnabled = toSignal(this.buzzerPressesControl.valueChanges.pipe(map(x => x ? x.length > 0 : false)));
  // isLocked = toSignal()
  buzzerForm = new FormGroup({
    code: new FormControl('', Validators.required),
  });
  myBuzzer = toSignal(this.myBuzzerGql.watch().valueChanges.pipe(map(result => result.data?.myBuzzer)));
  scoreboard = signal<Score[]>([]);
  private _buzzerSubscription?: Subscription;
  private _scoreboardSubscription?: Subscription;

  constructor() {
    this.form = new FormGroup({
      responses: this.buzzerPressesControl
    });

    effect(() => {
      const myBuzzer = this.myBuzzer();
      if (!myBuzzer?.name) return;
      const code = myBuzzer.name;
      this.buzzerForm.controls.code.setValue(code);
    });

    effect(() => {
      this._closeBuzzerSubscription();
      this._closeScoreboardSubscription();
      const code = this.myBuzzer()?.name;
      if (!code) return;

      this._buzzerSubscription = this.buzzerPressesGql.subscribe({ code })
        .subscribe(result => {
          if (!result.data?.buzzerPresses.action) return;
          if (!result.data?.buzzerPresses.presses) return;
          if (result.data.buzzerPresses.action === 'HEARTBEAT') return;
          if (result.data.buzzerPresses.action === 'INITIAL') {
            this.buzzerPresses.set(this.compareDateTimes(result.data.buzzerPresses.presses));
          }
          if (result.data.buzzerPresses.action === 'DELETE') {
            const deletedIdLookup = result.data.buzzerPresses.presses.reduce(
              (lookup, press) => {
                lookup[press.user.id] = true;
                return lookup;
              },
              {} as Record<string, boolean>
            )
            this.buzzerPresses.set(this.compareDateTimes(this.buzzerPresses().filter(press => !deletedIdLookup[press.user.id])));
          }
          if (result.data.buzzerPresses.action === 'CREATE') {
            this.buzzerPresses.set(this.compareDateTimes([...this.buzzerPresses(), ...result.data.buzzerPresses.presses]));
          }
          if (result.data.buzzerPresses.action === 'UPDATE') {
            const updateLookup = result.data.buzzerPresses.presses.reduce(
              (lookup, press) => {
                lookup[press.user.id] = press;
                return lookup;
              },
              {} as Record<string, BuzzerPress>
            )
            this.buzzerPresses.set(this.compareDateTimes(this.buzzerPresses().map(press => updateLookup[press.user.id] || press)));
          }
        });

      this._scoreboardSubscription = this.scoreboardGql.subscribe({ code })
        .subscribe(result => {
          if (!result.data?.scoreboard.action) return;
          if (!result.data?.scoreboard.scores) return;
          if (result.data.scoreboard.action === 'HEARTBEAT') return;
          if (result.data.scoreboard.action === 'INITIAL') {
            this.scoreboard.set(result.data.scoreboard.scores.sort(this._sortByScore) || []);
          }
          if (result.data.scoreboard.action === 'DELETE') {
            const deletedIdLookup = result.data.scoreboard.scores.reduce(
              (lookup, score) => {
                lookup[score.user.id] = true;
                return lookup;
              },
              {} as Record<string, boolean>
            )
            this.scoreboard.set(this.scoreboard().filter(score => !deletedIdLookup[score.user.id]).sort(this._sortByScore));
          }
          if (result.data.scoreboard.action === 'CREATE') {
            this.scoreboard.set([...this.scoreboard(), ...result.data.scoreboard.scores].sort(this._sortByScore));
          }
          if (result.data.scoreboard.action === 'UPDATE') {
            const updateLookup = result.data.scoreboard.scores.reduce(
              (lookup, score) => {
                lookup[score.user.id] = score;
                return lookup;
              },
              {} as Record<string, Score>
            )
            this.scoreboard.set(this.scoreboard().map(score => updateLookup[score.user.id] || score).sort(this._sortByScore));
          }
        });
    });
  }

  ngOnDestroy() {
    this._closeBuzzerSubscription();
    this._closeScoreboardSubscription();
  }

  compareDateTimes = (buzzerPresses: BuzzerPress[]): BuzzerPressWithTime[] => {
    if (buzzerPresses.length < 2) return buzzerPresses.map(press => ({ ...press, time: '' }));
    const withTime: BuzzerPressWithTime[] = [];
    for (let i = 0; i <= buzzerPresses.length - 2; i++) {
      if (i === 0) withTime.push({ ...buzzerPresses[i], time: '' });
      const pressDateTime = buzzerPresses[i].pressedAt;
      const nextPressDateTime = buzzerPresses[i + 1].pressedAt;
      const time = new Date(nextPressDateTime).getTime() - new Date(pressDateTime).getTime();
      withTime.push({ ...buzzerPresses[i + 1], time: this.millisecondsToHumanReadable(time) });
    }
    return withTime;
  }

  millisecondsToHumanReadable(ms: number) {
    // 1 second = 1000 milliseconds
    // 1 minute = 60 seconds
    // 1 hour = 60 minutes
    // 1 day = 24 hours

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000));

    const timeString = [];
    if (days > 0) {
      timeString.push(`${days} day${days > 1 ? 's' : ''}`);
    }
    if (hours > 0) {
      timeString.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0) {
      timeString.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    }
    if (seconds > 0) {
      timeString.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    }
    if (milliseconds > 0) {
      timeString.push(`${milliseconds} ms`);
    }

    return timeString.join(', ');
  }

  createBuzzer = async () => {
    const code = this.buzzerForm.controls.code.value;
    if (!code) return;

    try {
      await firstValueFrom(
        this.createBuzzerGql.mutate(
          { code },
          {
            update: (cache, { data }) => {
              cache.writeQuery({
                query: MyBuzzerDocument,
                data: {
                  myBuzzer: data?.createBuzzer
                }
              });
            }
          }
        )
      );
    } catch (error) { }
  }

  updateBuzzerCode = async () => {
    const code = this.buzzerForm.controls.code.value;
    if (!code) return;

    try {
      await firstValueFrom(
        this.updateBuzzerCodeGql.mutate(
          { code },
          {
            update: (cache, { data }) => {
              cache.writeQuery({
                query: MyBuzzerDocument,
                data: {
                  myBuzzer: data?.updateBuzzerCode
                }
              });
            }
          }
        )
      );
    } catch (error) { }
  }

  clearSelected = async () => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    const userIds = (this.buzzerPressesControl.value || []).filter(press => !!press);
    if (!userIds.length) return;

    try {
      await firstValueFrom(this.clearSelectedBuzzerPressesGql.mutate({ input: { code, userIds } }));
      this.buzzerPressesControl.setValue([])
    }
    catch (error) { }
  }

  clearAll = async () => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    try {
      await firstValueFrom(this.clearAllBuzzerPressesGql.mutate({ code }));
      this.buzzerPressesControl.setValue([])
    } catch (error) { }
  }

  lockBuzzer = async () => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    try {
      await firstValueFrom(
        this.lockBuzzerGql.mutate(
          { code },
          {
            update: (cache, { data }) => {
              cache.writeQuery({
                query: MyBuzzerDocument,
                data: {
                  myBuzzer: data?.lockBuzzer
                }
              });
            }
          }
        )
      );
    } catch (error) { }
  }

  unlockBuzzer = async () => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    try {
      await firstValueFrom(
        this.unlockBuzzerGql.mutate(
          { code },
          {
            update: (cache, { data }) => {
              cache.writeQuery({
                query: MyBuzzerDocument,
                data: {
                  myBuzzer: data?.unlockBuzzer
                }
              });
            }
          }
        )
      );
    } catch (error) { }
  }

  increaseScore = (score: Score) => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    this.increaseScoreGql.mutate({
      input: {
        code,
        userId: score.user.id
      }
    })
      .pipe(take(1))
      .subscribe();
  }

  decreaseScore = (score: Score) => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    this.decreaseScoreGql.mutate({
      input: {
        code,
        userId: score.user.id
      }
    })
      .pipe(take(1))
      .subscribe();
  }

  removeFromScoreboard = (score: Score) => {
    const code = this.myBuzzer()?.name;
    if (!code) return;

    this.removeFromScoreboardGql.mutate({
      input: {
        code,
        userId: score.user.id
      }
    })
      .pipe(take(1))
      .subscribe();
  }

  private _sortByScore = (a: Score, b: Score) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  };

  private _closeBuzzerSubscription() {
    if (this._buzzerSubscription) {
      this._buzzerSubscription.unsubscribe();
    }
  }

  private _closeScoreboardSubscription() {
    if (this._scoreboardSubscription) {
      this._scoreboardSubscription.unsubscribe();
    }
  }
}
