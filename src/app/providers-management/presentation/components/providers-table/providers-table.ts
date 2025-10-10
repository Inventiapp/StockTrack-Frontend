import {Component} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {TranslatePipe} from '@ngx-translate/core';
import {ProvidersApi} from '../../../infrastructure/providers-api';
import {Provider} from '../../../../inventory/domain/model/provider.entity';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {ProviderFormDialog} from '../provider-form-dialog/provider-form-dialog';

@Component({
  selector: 'app-providers-table',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    TranslatePipe,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatIconModule,
    MatIconButton
  ],
  templateUrl: './providers-table.html',
  styleUrl: './providers-table.css'
})
export class ProvidersTable {
  displayedColumns: string[] = ['firstName', 'phone', 'email', 'ruc', 'actions'];
  dataSource: Provider[] = [];

  constructor(private providersApi: ProvidersApi, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.providersApi.getProviders().subscribe((providers: Provider[]) => {
      this.dataSource = providers;
    });
  }

  onEdit(p: Provider) {
    const ref = this.dialog.open(ProviderFormDialog, {
      width: '720px',
      data: p,
      disableClose: true
    });

    ref.afterClosed().subscribe((updated?: Provider) => {
      if (!updated) return; // cancelado

      // Reemplaza en dataSource sin recargar
      const data = [...this.dataSource];
      const i = data.findIndex(x => x.id === updated.id);
      if (i > -1) {
        data[i] = updated;
        this.dataSource = data;
      }
    });
  }

  onDelete(provider: Provider) {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.providersApi.deleteProvider(+(provider.id)).subscribe(() => {
        this.dataSource = this.dataSource.filter(p => p.id !== provider.id);
      });
    }
  }

}

