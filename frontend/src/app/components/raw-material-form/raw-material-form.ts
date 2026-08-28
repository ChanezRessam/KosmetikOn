import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RawMaterialService } from '../../services/raw-material';

@Component({
  selector: 'app-raw-material-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raw-material-form.html',
  styleUrl: './raw-material-form.css',
})
export class RawMaterialForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  materialId: number | null = null;
  loading = false;
  submitError = '';

  categories = ['emollient', 'surfactant', 'preservative', 'active ingredient', 'fragrance'];
  units = ['kg', 'g', 'l', 'ml'];

  constructor(
    private fb: FormBuilder,
    private rawMaterialService: RawMaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', Validators.required],
      unit_of_measure: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      status: ['active', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.materialId = Number(idParam);
      this.loadMaterial(this.materialId);
    }
  }

  loadMaterial(id: number): void {
    this.loading = true;
    this.rawMaterialService.getById(id).subscribe({
      next: (material) => {
        this.form.patchValue(material);
        this.loading = false;
      },
      error: () => {
        this.submitError = 'Unable to load this raw material.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitError = '';
    this.loading = true;
    const formValue = { ...this.form.value, quantity: Number(this.form.value.quantity) };

    const request = this.isEditMode && this.materialId
      ? this.rawMaterialService.update(this.materialId, formValue)
      : this.rawMaterialService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/raw-materials']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.submitError = err.error?.message || 'A raw material with this name or code already exists.';
        } else if (err.status === 400) {
          this.submitError = 'Please correct the form errors.';
        } else {
          this.submitError = 'An error occurred. Please check that the server is running.';
        }
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/raw-materials']);
  }

  get f() {
    return this.form.controls;
  }
}