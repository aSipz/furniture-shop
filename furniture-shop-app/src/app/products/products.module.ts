import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { RatingComponent } from './rating/rating.component';
import { LikeProductComponent } from './like-product/like-product.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewComponent } from './review/review.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddEditReviewComponent } from './add-edit-review/add-edit-review.component';
import { InitialModule } from '../initial/initial.module';
import { StoreModule } from '@ngrx/store';
import { productReducers } from './+store';
import { EffectsModule } from '@ngrx/effects';
import { ProductDetailsEffects } from './+store/effects/detailsEffects';
import { CatalogEffects } from './+store/effects/catalogEffects';
import { FavoritesEffects } from './+store/effects/favoritesEffects';



@NgModule({
  declarations: [
    ProductDetailsComponent,
    ImageSliderComponent,
    RatingComponent,
    LikeProductComponent,
    FavoritesComponent,
    CatalogComponent,
    ReviewListComponent,
    ReviewComponent,
    AddEditReviewComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    InitialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('products', productReducers),
    EffectsModule.forFeature([ProductDetailsEffects, CatalogEffects, FavoritesEffects]),
  ]
})
export class ProductsModule { }