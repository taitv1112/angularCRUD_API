import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "./product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  public getProductList():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiServerUrl}/product/findAll`);
}
public addProduct(product:Product):Observable<Product>{
    return this.http.post<Product>(`${this.apiServerUrl}/product/save`, product);
}
  public updateProduct(product:Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiServerUrl}/product/update`, product);
  }
  public deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/product/delete/${productId}`);
  }
}
