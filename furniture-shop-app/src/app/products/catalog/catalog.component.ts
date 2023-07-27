import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { loadingProduct, pageSize } from 'src/app/shared/constants';
import { IProduct } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/user/user.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  pages!: number;
  pageSize = pageSize;
  errorFetchingData = false;
  private sub!: Subscription;

  get isAdmin() {
    return this.userService.isAdmin;
  }

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(query => {
      const changedQuery = JSON.parse(JSON.stringify(query));

      if (!query['skip']) {
        changedQuery['skip'] = 0;
        changedQuery['limit'] = this.pageSize;
      }

      if (!this.isAdmin) {
        if (!query['search']) {
          changedQuery['search'] = { deleted: false };
        } else {
          const search = JSON.parse(changedQuery['search']);
          search.deleted = false;
          changedQuery['search'] = search;
        }
      } else {
        query['search']
          ? changedQuery['search'] = JSON.parse(changedQuery['search'])
          : changedQuery['search'] = {};
      }

      this.productsService.getProducts(changedQuery).subscribe({
        next: value => {
          this.products = value.result;
          this.pages = Math.ceil(value.count / this.pageSize);
        },
        error: err => {
          this.errorFetchingData = true;
          console.log(err);
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}