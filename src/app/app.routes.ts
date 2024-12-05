import { Routes } from '@angular/router';
import { ChristmasComponent } from './christmas/christmas.component';
import { AgendaComponent } from './agenda/agenda.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import { BuzzerManagementComponent } from './buzzer-management/buzzer-management.component';
import { AuthGuard } from './auth-guard.service';

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
                canActivate: [AuthGuard],
                component: BuzzerComponent
            },
            {
                path: 'lyrics',
                component: LyricsComponent
            },
            {
                path: 'admin',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'buzzer-management'
                    },
                    {
                        path: 'buzzer-management',
                        component: BuzzerManagementComponent
                    }
                ]
            }
        ]
    },
    { path: '**', redirectTo: 'christmas' }
];
