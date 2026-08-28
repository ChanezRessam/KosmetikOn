import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawMaterial, PaginatedResponse, RawMaterialFilters } from '../models/raw-material';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {
  private apiUrl = 'http://localhost:3000/raw-materials';

  constructor(private http: HttpClient) {}

  getAll(filters: RawMaterialFilters): Observable<PaginatedResponse<RawMaterial>> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page);
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize);
    if (filters.name) params = params.set('name', filters.name);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<PaginatedResponse<RawMaterial>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<RawMaterial> {
    return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`);
  }

  create(material: RawMaterial): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(this.apiUrl, material);
  }

  update(id: number, material: RawMaterial): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(`${this.apiUrl}/${id}`, material);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}