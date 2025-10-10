import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UserStore } from '../../application/user.store';
import { User, UserRole, UserStatus } from '../../domain/user.model';

@Component({
  selector: 'app-personal-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './personal-administration.html',
  styleUrl: './personal-administration.css'
})
export class PersonalAdministrationComponent {
  private translate = inject(TranslateService);
  private userStore = inject(UserStore);

  searchTerm = signal<string>('');
  filterStatus = signal<string>('todos');
  filterRole = signal<string>('todos');
  showFilterDropdown = signal<boolean>(false);
  showUserModal = signal<boolean>(false);
  showRoleModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  newUser = signal({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    role: ''
  });

  selectedUser = signal<User | null>(null);

  newRole = signal({
    name: '',
    permissions: {
      productos: false,
      compras: false,
      estadisticas: false,
      usuarios: false
    }
  });

  users = this.userStore.users;
  roles = this.userStore.availableRoles;
  loading = this.userStore.loading;
  error = this.userStore.error;
  hasUsers = this.userStore.hasUsers;
  activeUsers = this.userStore.activeUsers;
  adminUsers = this.userStore.adminUsers;

  protected t(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get filteredUsers() {
    const search = this.searchTerm().toLowerCase();
    return this.users().filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesStatus =
        this.filterStatus() === 'todos' || user.status === this.filterStatus();

      const matchesRole =
        this.filterRole() === 'todos' || user.role === this.filterRole();

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  openUserModal() { this.showUserModal.set(true); }
  closeUserModal() { 
    this.showUserModal.set(false);
    this.newUser.set({ name: '', lastname: '', phone: '', email: '', role: '' });
  }

  openRoleModal() { this.showRoleModal.set(true); }
  closeRoleModal() { 
    this.showRoleModal.set(false);
    this.newRole.set({
      name: '',
      permissions: { productos: false, compras: false, estadisticas: false, usuarios: false }
    });
  }

  openEditModal(user: User) {
    this.selectedUser.set(user);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
  }

  openDeleteModal(user: User) {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  toggleFilterDropdown() {
    this.showFilterDropdown.set(!this.showFilterDropdown());
  }

  closeFilterDropdown() {
    this.showFilterDropdown.set(false);
  }

  clearFilters() {
    this.filterStatus.set('todos');
    this.filterRole.set('todos');
    this.searchTerm.set('');
    this.showFilterDropdown.set(false);
  }

  saveUser() {
    const userData = this.newUser();
    if (!userData.name || !userData.email || !userData.role) return;

    const role = userData.role === 'Administrador' ? UserRole.ADMIN : UserRole.VENDOR;
    
    this.userStore.createUser({
      name: `${userData.name} ${userData.lastname}`.trim(),
      role: role,
      email: userData.email,
      status: UserStatus.ACTIVE
    });

    this.closeUserModal();
  }

  saveEditedUser() {
    const user = this.selectedUser();
    if (!user) return;

    this.userStore.updateUser(user.id, {
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status
    });

    this.closeEditModal();
  }

  confirmDeleteUser() {
    const user = this.selectedUser();
    if (!user) return;

    this.userStore.deleteUser(user.id);
    this.closeDeleteModal();
  }

  saveRole() {
    const roleData = this.newRole();
    if (roleData.name.trim() === '') return;

    const exists = this.roles.some(r => r.name.toLowerCase() === roleData.name.toLowerCase());
    if (exists) {
      alert('El rol ya existe');
      return;
    }

    // TODO: Implement role creation in backend
    console.log('Role to create:', roleData);
    this.closeRoleModal();
  }

  getUserRoleDisplay(role: UserRole): string {
    return role === UserRole.ADMIN ? 'Administrador' : 'Vendedor';
  }

  getUserStatusDisplay(status: UserStatus): string {
    return status === UserStatus.ACTIVE ? 'Activo' : 'Inactivo';
  }
}
