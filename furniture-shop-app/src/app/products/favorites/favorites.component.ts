import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces';
import { loadingProduct } from 'src/app/shared/constants';
import { FavoritesService } from '../favorites.service';
import { UserService } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  errorFetchingData = false;
  private sub!: Subscription;

  get userId() {
    return this.userService.user?._id;
  }

  constructor(
    private favoritesService: FavoritesService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(query => {
      this.favoritesService.getAll(query).subscribe({
        next: value => this.products = value.result,
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
