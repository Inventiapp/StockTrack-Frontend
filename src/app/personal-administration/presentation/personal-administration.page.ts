import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './personal-administration.page.html',
  styleUrls: ['./personal-administration.page.css']
})
export class PersonalAdministrationPage {
  private translate = inject(TranslateService);

  protected t(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  searchTerm: string = '';
  filterStatus: string = 'todos';
  filterRole: string = 'todos';
  showFilterDropdown: boolean = false;
  showUserModal = false;
  showRoleModal = false;
  showEditModal = false;
  showDeleteModal = false;

  roles = [
    { name: 'Vendedor', permissions: { productos: true, compras: true, estadisticas: false, usuarios: false } },
    { name: 'Administrador', permissions: { productos: true, compras: true, estadisticas: true, usuarios: true } }
  ];

  users = [
    { id: 1, name: 'Juan Pérez Díaz', role: 'Vendedor', account: 'perez.j@company.com', status: 'Activo' },
    { id: 2, name: 'María López Gonzales', role: 'Vendedor', account: 'lopez.m@company.com', status: 'Inactivo' },
    { id: 3, name: 'Luis Ramírez Hurtado', role: 'Vendedor', account: 'ramirez.l@company.com', status: 'Activo' },
    { id: 4, name: 'Juan Pérez Aguirre', role: 'Administrador', account: 'admin@company.com', status: 'Activo' }
  ];

  newUser = { name: '', lastname: '', phone: '', email: '', role: '' };
  selectedUser: any = null;

  newRole = {
    name: '',
    permissions: {
      productos: false,
      compras: false,
      estadisticas: false,
      usuarios: false
    }
  };

  openUserModal() { this.showUserModal = true; }
  closeUserModal() { this.showUserModal = false; }

  openRoleModal() { this.showRoleModal = true; }
  closeRoleModal() { this.showRoleModal = false; }

  openEditModal(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  openDeleteModal(user: any) {
    this.selectedUser = { ...user };
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  closeFilterDropdown() {
    this.showFilterDropdown = false;
  }

  clearFilters() {
    this.filterStatus = 'todos';
    this.filterRole = 'todos';
    this.searchTerm = '';
    this.showFilterDropdown = false;
  }

  get filteredUsers() {
    const search = this.searchTerm.toLowerCase();
    return this.users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.account.toLowerCase().includes(search);

      const matchesStatus =
        this.filterStatus === 'todos' || user.status === this.filterStatus;

      const matchesRole =
        this.filterRole === 'todos' || user.role === this.filterRole;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  saveUser() {
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    this.users.push({
      id: newId,
      name: `${this.newUser.name} ${this.newUser.lastname}`,
      role: this.newUser.role,
      account: this.newUser.email,
      status: 'Activo'
    });
    this.closeUserModal();
    this.newUser = { name: '', lastname: '', phone: '', email: '', role: '' };
  }

  saveEditedUser() {
    const index = this.users.findIndex(u => u.id === this.selectedUser.id);
    if (index > -1) this.users[index] = { ...this.selectedUser };
    this.closeEditModal();
  }

  confirmDeleteUser() {
    this.users = this.users.filter(u => u.id !== this.selectedUser.id);
    this.closeDeleteModal();
  }

  saveRole() {
    if (this.newRole.name.trim() === '') return;

    const exists = this.roles.some(r => r.name.toLowerCase() === this.newRole.name.toLowerCase());
    if (!exists) {
      this.roles.push({ ...this.newRole });
    }

    this.newRole = {
      name: '',
      permissions: { productos: false, compras: false, estadisticas: false, usuarios: false }
    };
    this.closeRoleModal();
  }
}
