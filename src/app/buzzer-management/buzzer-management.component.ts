import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { map } from 'rxjs';
import { BuzzerPress, BuzzerPressesGQL } from '../../../graphql/generated';

export type BuzzerPressWithTime = BuzzerPress & {
  time: string
}

@Component({
  selector: 'app-buzzer-management',
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './buzzer-management.component.html',
  styleUrl: './buzzer-management.component.scss'
})
export class BuzzerManagementComponent implements OnInit {
  private buzzerPressesGql = inject(BuzzerPressesGQL)

  form: FormGroup;
  buzzerPresses = signal<BuzzerPressWithTime[]>([]);
  buzzerPressesControl = new FormControl<number[]>([]);
  isClearSelectedEnabled = toSignal(this.buzzerPressesControl.valueChanges.pipe(map(x => x ? x.length > 0 : false)));
  // isLocked = toSignal()

  constructor() {
    this.form = new FormGroup({
      responses: this.buzzerPressesControl
    });
  }

  ngOnInit() {
    this.buzzerPressesGql.subscribe({ id: 'test' })
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

  clearSelected = () => {
    const lookup = (this.buzzerPressesControl.value || []).reduce((lookup, id) => {
      lookup[id] = true;
      return lookup;
    }, {} as Record<string, boolean>);

    this.buzzerPresses.set(this.buzzerPresses().filter(press => !lookup[press.user.id]));
    this.buzzerPressesControl.setValue([])
  }

  clearAll = () => {
    this.buzzerPresses.set([]);
    this.buzzerPressesControl.setValue([])
  }

  lockBuzzer = () => {
    console.log('lock buzzer');
  }

  unlockBuzzer = () => {
    console.log('unlock buzzer');
  }
}
