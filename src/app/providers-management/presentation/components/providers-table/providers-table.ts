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
  displayedColumns: string[] = ['firstName', 'phone', 'email', 'ruc','actions'];
  dataSource: Provider[] = [];

  constructor(private providersApi: ProvidersApi) {}

  ngOnInit(): void {
    this.providersApi.getProviders().subscribe((providers: Provider[]) => {
      this.dataSource = providers;
    });
  }

  onEdit(onClick: any) {

  }

  onDelete(onClick: any) {

  }
}

// const ElementData = [
//   {firstName: 1, phone: 'Hydrogen', email: 1.0079, ruc: 'H'},
// ]
