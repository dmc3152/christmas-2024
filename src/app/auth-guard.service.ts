import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { GetUnauthenticatedSelfGQL } from '../../graphql/generated';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private getUnauthenticatedSelf = inject(GetUnauthenticatedSelfGQL);
  private dialog = inject(MatDialog);

  constructor() { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (await this.isAuthenticated()) {
      return true;
    } else {
      const dialogRef = this.dialog.open(LoginModalComponent, { disableClose: true });
      return !!firstValueFrom(dialogRef.afterClosed());
    }
  }

  private isAuthenticated = async (): Promise<boolean> => {
    const result = await firstValueFrom(this.getUnauthenticatedSelf.fetch()
      .pipe(
        catchError(() => of({
          data: {
            unauthenticatedSelf: {
              name: ''
            }
          }
        }))
      ));
    return !!result.data.unauthenticatedSelf?.name;
  }
}
