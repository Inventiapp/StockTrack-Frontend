import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserStore } from '../../../application/user.store';
import { User, Permission } from '../../../domain/user.model';

export interface UserFormDialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslatePipe
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.css'
})
export class UserFormDialog implements OnInit {
  saving = false;
  form!: FormGroup;

  readonly Permission = Permission;
  
  readonly availablePermissions = [
    { 
      value: Permission.DASHBOARD_ACCESS, 
      i18nKey: 'personalAdministration.permissionDashboard',
      icon: 'dashboard',
      color: '#3b82f6'
    },
    { 
      value: Permission.INVENTORY_ACCESS, 
      i18nKey: 'personalAdministration.permissionInventory',
      icon: 'inventory_2',
      color: '#10b981'
    },
    { 
      value: Permission.SALES_ACCESS, 
      i18nKey: 'personalAdministration.permissionSales',
      icon: 'point_of_sale',
      color: '#f59e0b'
    },
    { 
      value: Permission.PROVIDERS_ACCESS, 
      i18nKey: 'personalAdministration.permissionProviders',
      icon: 'local_shipping',
      color: '#8b5cf6'
    },
    { 
      value: Permission.REPORTS_ACCESS, 
      i18nKey: 'personalAdministration.permissionReports',
      icon: 'assessment',
      color: '#ef4444'
    },
    { 
      value: Permission.USER_MANAGEMENT_ACCESS, 
      i18nKey: 'personalAdministration.permissionUserManagement',
      icon: 'people',
      color: '#06b6d4'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private userStore: UserStore,
    private ref: MatDialogRef<UserFormDialog>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData
  ) {}

  ngOnInit(): void {
    const isEditMode = this.data.mode === 'edit' && this.data.user;
    const user = this.data.user;
    
    // Initialize permissions based on mode
    const permissionControls = this.availablePermissions.map(perm => {
      const hasPermission = isEditMode && user ? user.hasPermission(perm.value) : false;
      return this.fb.control(hasPermission);
    });
    
    this.form = this.fb.group({
      email: [isEditMode && user ? user.email : '', [Validators.required, Validators.email]],
      password: ['', isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      permissions: this.fb.array(permissionControls)
    });
  }

  get permissionsFormArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  getSelectedPermissionsCount(): number {
    return this.permissionsFormArray.controls.filter(control => control.value).length;
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
    const { email, password, permissions } = this.form.value;
    
    // Get selected permissions
    const selectedPermissions = this.availablePermissions
      .filter((_, index) => permissions[index])
      .map(perm => perm.value);
    
    if (this.data.mode === 'edit' && this.data.user) {
      // Update user
      const updatePassword = password && password.trim() !== '' ? password : undefined;
      this.userStore.updateUser(this.data.user.id, email, updatePassword, selectedPermissions);
    } else {
      // Create user
      this.userStore.createUser(email, password, selectedPermissions);
    }
    
    // Wait for loading to complete, then close dialog
    const checkLoading = setInterval(() => {
      if (!this.userStore.loading()) {
        clearInterval(checkLoading);
        this.saving = false;
        this.ref.close(true);
      }
    }, 100);
    
    // Timeout fallback (5 seconds)
    setTimeout(() => {
      clearInterval(checkLoading);
      if (this.saving) {
        this.saving = false;
        this.ref.close(true);
      }
    }, 5000);
  }
}

