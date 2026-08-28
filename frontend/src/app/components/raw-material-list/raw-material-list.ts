import { AuthService } from '../../services/auth';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RawMaterialService } from '../../services/raw-material';
import { RawMaterial } from '../../models/raw-material';


@Component({
  selector: 'app-raw-material-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './raw-material-list.html',
  styleUrl: './raw-material-list.css',
})
export class RawMaterialList implements OnInit {
  materials: RawMaterial[] = [];
  loading = false;
  hasLoaded = false;
  errorMessage = '';

  // Filtres
  filterName = '';
  filterCategory = '';
  filterStatus = '';

  // Pagination
  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 0;

  // Confirmation de suppression
  materialToDelete: RawMaterial | null = null;

  constructor(
    private rawMaterialService: RawMaterialService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rawMaterialService
      .getAll({
        page: this.page,
        pageSize: this.pageSize,
        name: this.filterName || undefined,
        category: this.filterCategory || undefined,
        status: this.filterStatus || undefined,
      })
      .subscribe({
        next: (response) => {
          this.materials = response.items ?? [];
          this.total = response.pagination?.total ?? 0;
          this.totalPages = response.pagination?.totalPages ?? 0;
          this.loading = false;
          this.hasLoaded = true;
        },
        error: (err) => {
          this.errorMessage = 'Unable to load raw materials. Please verify that the backend server is running.';
          this.materials = [];
          this.total = 0;
          this.totalPages = 0;
          this.loading = false;
          this.hasLoaded = true;
          console.error(err);
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadMaterials();
  }

  resetFilters(): void {
    this.filterName = '';
    this.filterCategory = '';
    this.filterStatus = '';
    this.page = 1;
    this.loadMaterials();
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadMaterials();
  }

  createNew(): void {
    this.router.navigate(['/raw-materials/new']);
  }

  editMaterial(id: number | undefined): void {
    if (id) this.router.navigate(['/raw-materials', id, 'edit']);
  }

  confirmDelete(material: RawMaterial): void {
    this.materialToDelete = material;
  }
  
  logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
  }
  
  cancelDelete(): void {
    this.materialToDelete = null;
  }

  deleteConfirmed(): void {
    if (!this.materialToDelete?.id) return;

    this.rawMaterialService.delete(this.materialToDelete.id).subscribe({
      next: () => {
        this.materialToDelete = null;
        this.loadMaterials();
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while deleting.';
        this.materialToDelete = null;
        console.error(err);
      },
    });
  }
}