import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-administration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-administration.page.html',
  styleUrls: ['./personal-administration.page.css']
})
export class PersonalAdministrationPage {
  searchTerm: string = '';
  filterStatus: string = 'todos';
  filterRole: string = 'todos';
  showFilterDropdown: boolean = false;

  // Control de modales
  showUserModal = false;
  showRoleModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // === LISTA DE ROLES DINÁMICA ===
  roles = [
    { name: 'Vendedor', permissions: { productos: true, compras: true, estadisticas: false, usuarios: false } },
    { name: 'Administrador', permissions: { productos: true, compras: true, estadisticas: true, usuarios: true } }
  ];

  // === USUARIOS ===
  users = [
    { id: 1, name: 'Juan Pérez Díaz', role: 'Vendedor', account: 'perez.j@company.com', status: 'Activo' },
    { id: 2, name: 'María López Gonzales', role: 'Vendedor', account: 'lopez.m@company.com', status: 'Inactivo' },
    { id: 3, name: 'Luis Ramírez Hurtado', role: 'Vendedor', account: 'ramirez.l@company.com', status: 'Activo' },
    { id: 4, name: 'Juan Pérez Aguirre', role: 'Administrador', account: 'admin@company.com', status: 'Activo' }
  ];

  // === NUEVO USUARIO / ROL ===
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

  // === FUNCIONES PARA MODALES ===
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

  // === FUNCIONES FILTRO ===
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

  // === FILTRADO DE USUARIOS ===
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

  // === GUARDAR USUARIO NUEVO ===
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

  // === GUARDAR USUARIO EDITADO ===
  saveEditedUser() {
    const index = this.users.findIndex(u => u.id === this.selectedUser.id);
    if (index > -1) this.users[index] = { ...this.selectedUser };
    this.closeEditModal();
  }

  // === ELIMINAR USUARIO ===
  confirmDeleteUser() {
    this.users = this.users.filter(u => u.id !== this.selectedUser.id);
    this.closeDeleteModal();
  }

  // === GUARDAR NUEVO ROL ===
  saveRole() {
    if (this.newRole.name.trim() === '') return;

    // Evita duplicar roles con el mismo nombre
    const exists = this.roles.some(r => r.name.toLowerCase() === this.newRole.name.toLowerCase());
    if (!exists) {
      this.roles.push({ ...this.newRole });
    }

    // Limpia y cierra modal
    this.newRole = {
      name: '',
      permissions: { productos: false, compras: false, estadisticas: false, usuarios: false }
    };
    this.closeRoleModal();
  }
}
