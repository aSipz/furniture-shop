import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces';
import { loadingProduct, pageSize } from 'src/app/shared/constants';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  pages!: number;
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
        changedQuery['limit'] = pageSize;
      }
      this.favoritesService.getAll(changedQuery).subscribe({
        next: value => {
          this.products = value.result;
          this.pages = Math.ceil(value.count / pageSize);
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
