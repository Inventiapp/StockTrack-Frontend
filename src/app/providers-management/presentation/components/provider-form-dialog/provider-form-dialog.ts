import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {ProvidersApi} from '../../../infrastructure/providers-api';
import {Provider} from '../../../../inventory/domain/model/provider.entity';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-provider-form-dialog',
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    TranslatePipe
  ],
  templateUrl: './provider-form-dialog.html'
})
export class ProviderFormDialog implements OnInit {
  saving = false;
  form!: FormGroup; // se inicializa en ngOnInit

  constructor(
    private fb: FormBuilder,
    private api: ProvidersApi,
    private ref: MatDialogRef<ProviderFormDialog, Provider>,
    @Inject(MAT_DIALOG_DATA) public data: Provider
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.data?.firstName ?? '', [Validators.required, Validators.maxLength(60)]],
      lastName: [this.data?.lastName ?? '', [Validators.required, Validators.maxLength(80)]],
      phoneNumber: [this.data?.phoneNumber ?? '', [Validators.required]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      ruc: [this.data?.ruc ?? '', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
    });
  }

  cancel(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const changes = this.form.getRawValue();
    const payload = new Provider({
      id: this.data.id,
      firstName: changes.firstName!,
      lastName: changes.lastName!,
      phoneNumber: changes.phoneNumber!,
      email: changes.email!,
      ruc: changes.ruc!
    });

    if (this.data.id) {
      const idNum = +this.data.id;
      this.api.updateProviderById(payload, idNum).subscribe({
        next: (updated: any) => this.ref.close(updated ?? payload),
        error: () => this.saving = false,
        complete: () => this.saving = false
      });
    } else {
      this.api.createProvider(payload).subscribe({
        next: (created: any) => this.ref.close(created ?? payload),
        error: () => this.saving = false,
        complete: () => this.saving = false
      });
    }
  }

}
