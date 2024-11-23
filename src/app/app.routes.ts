import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AgendaComponent } from './agenda/agenda.component';
import { BuzzerComponent } from './buzzer/buzzer.component';

export const routes: Routes = [
    {
        path: 'main',
        component: MainComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'agenda',
            },
            {
                path: 'agenda',
                component: AgendaComponent
            },
            {
                path: 'buzzer',
                component: BuzzerComponent,
            }
        ]
    },
    { path: '**', redirectTo: 'main' }
];
