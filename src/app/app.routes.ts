import { Routes } from '@angular/router';
import { ChristmasComponent } from './christmas/christmas.component';
import { AgendaComponent } from './agenda/agenda.component';
import { BuzzerComponent } from './buzzer/buzzer.component';

export const routes: Routes = [
    {
        path: 'christmas',
        component: ChristmasComponent,
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
    { path: '**', redirectTo: 'christmas' }
];
