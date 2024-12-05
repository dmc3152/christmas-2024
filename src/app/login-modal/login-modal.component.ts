import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignInAsUnauthenticatedUserGQL } from '../../../graphql/generated';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-modal',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  private signInAsUnauthenticatedUserMutation = inject(SignInAsUnauthenticatedUserGQL);
  private data = inject<{name: string | undefined}>(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<LoginModalComponent>) { }

  name = new FormControl(this.data.name, Validators.required);

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit = async () => {
    if (this.name.invalid || !this.name.value) return;

    const result = await firstValueFrom(this.signInAsUnauthenticatedUserMutation.mutate({ name: this.name.value }));
    this.dialogRef.close(result.data?.signInAsUnauthenticatedUser?.name);
  }
}
