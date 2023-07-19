import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { authActivate } from '../shared/guards/auth.activate';
import { CatalogComponent } from './catalog/catalog.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CatalogComponent,
    data: {
      title: 'Shop',
      animation: 'shopPage'
    }
  },
  {
    path: ':id/details',
    component: ProductDetailsComponent,
    data: {
      title: 'Product Details',
      animation: 'productDetailsPage'
    }
  },
  {
    path: 'favorites',
    canActivate: [authActivate],
    component: FavoritesComponent,
    data: {
      title: 'Favorites',
      animation: 'favoritesPage',
      loginRequired: true,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
