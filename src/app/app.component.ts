import {Component, OnInit} from '@angular/core';
import {Product} from "./product";
import {ProductService} from "./product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {finalize, Observable} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {rejects} from "assert";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public products: Product[];
  public editProduct: Product;
  public deleteProduct: Product;
  public product:Product;
  public checkUploadFile = true;
  title = 'case';
  // // @ts-ignore
  // selectedFile: null;
  public fb: string = "";
  downloadURL: Observable<string>;

  constructor(private productService: ProductService, private storage: AngularFireStorage) {
  }
  ngOnInit() {
  this.getProducts();
  }
  onFileSelected(event:any) {
    this.checkUploadFile = false;
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.checkUploadFile = true;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }


  public getProducts():void{
    this.productService.getProductList().subscribe(
      (response:Product[])=>{
        this.products = response;
        console.log(this.products);
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }



  public onAddProduct(addForm: NgForm): void {
    // @ts-ignore
    document.getElementById('add-product-form').click();
    console.log("add product ", this.fb)
    addForm.value.img = this.fb;
    console.log(addForm.value);
    this.productService.addProduct(addForm.value).subscribe(
      (response: Product) => {
        console.log(response);
        this.getProducts();
        addForm.reset();
        this.fb="";
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );

  }


  public onUpdateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe(
      (response: Product) => {
        console.log(response);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      (response: void) => {
        console.log(response);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchProduct(key: string): void {
    console.log(key);
    const results: Product[] = [];
    for (const product of this.products) {
      if (product.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || product.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
       ) {
        results.push(product);
      }
    }
    this.products = results;
    if (results.length === 0 || !key) {
      this.getProducts();
    }
  }
  public onOpenModal(product: Product, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addProductModal');
    }
    if (mode === 'edit') {
      this.editProduct = product;
      button.setAttribute('data-target', '#updateProductModal');
    }
    if (mode === 'delete') {
      this.deleteProduct = product;
      button.setAttribute('data-target', '#deleteProductModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }



}


