import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { FavoritesService } from '../services/favorites.service';
import { loadingProduct, pageSize } from 'src/app/initial/constants';
import { IProduct } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  pages!: number;
  pageSize = pageSize;
  errorFetchingData = false;
  private sub!: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(query => {
     
      const changedQuery = JSON.parse(JSON.stringify(query));
      if (!query['skip']) {
        changedQuery['skip'] = 0;
        changedQuery['limit'] = this.pageSize;
      }

      query['search']
        ? changedQuery['search'] = JSON.parse(changedQuery['search'])
        : changedQuery['search'] = {};

      this.favoritesService.getAll(changedQuery).subscribe({
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