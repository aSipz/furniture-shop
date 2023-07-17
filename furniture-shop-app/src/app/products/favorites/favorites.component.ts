import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { IProduct } from 'src/app/shared/interfaces';
import { loadingProduct } from 'src/app/shared/constants';
import { FavoritesService } from '../favorites.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {

  products: IProduct[] = [loadingProduct, loadingProduct, loadingProduct];
  errorFetchingData = false;

  get userId() {
    return this.userService.user?._id;
  }

  constructor(
    private favoritesService: FavoritesService,
    private userService: UserService
  ) {

    this.favoritesService.getAll({ include: 'product', search: { owner: this.userId } }).subscribe({
      next: value => this.products = value.result.map(e => e.product as IProduct),
      error: err => {
        this.errorFetchingData = true;
        console.log(err);
      }
    });
  }

}
