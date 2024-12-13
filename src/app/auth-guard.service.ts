import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, RedirectCommand } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { GetUnauthenticatedSelfGQL } from '../../graphql/generated';

export const AuthGuard = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (await isAuthenticated()) {
    return true;
  }

  const dialogRef = dialog.open(LoginModalComponent, { disableClose: true });
  const value = await firstValueFrom(dialogRef.afterClosed());
  if (value) {
    return true;
  }
  
  const urlTree = router.parseUrl('/christmas');
  return new RedirectCommand(urlTree);
}

const isAuthenticated = async (): Promise<boolean> => {
  const getUnauthenticatedSelf = inject(GetUnauthenticatedSelfGQL);

  const result = await firstValueFrom(getUnauthenticatedSelf.fetch()
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

