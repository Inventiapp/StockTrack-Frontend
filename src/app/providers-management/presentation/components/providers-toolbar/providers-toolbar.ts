import {Component} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';

import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton, MatFabButton} from '@angular/material/button';
import {ProviderFormDialog} from '../provider-form-dialog/provider-form-dialog';
import {MatDialog} from '@angular/material/dialog';
import {Provider} from '../../../../inventory/domain/model/provider.entity';
import {ProvidersApi} from '../../../infrastructure/providers-api';

@Component({
  selector: 'app-providers-toolbar',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatIconModule,
    TranslatePipe,
    MatFabButton
  ],
  templateUrl: './providers-toolbar.html',
  styleUrl: './providers-toolbar.css'
})
export class ProvidersToolbar {
  searchTerm = '';
  dataSource: Provider[] = [];

  ngOnInit(): void {
    this.providersApi.getProviders().subscribe((providers: Provider[]) => {
      this.dataSource = providers;
    });
  }

  constructor(private providersApi: ProvidersApi, private dialog: MatDialog) {
  }


  onCreate() {
    const ref = this.dialog.open(ProviderFormDialog, {
      width: '720px',
      disableClose: true,
      data: {}
    });

  }
}
