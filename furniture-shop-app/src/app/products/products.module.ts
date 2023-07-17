import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { RatingComponent } from './rating/rating.component';
import { LikeProductComponent } from './like-product/like-product.component';
import { FavoritesComponent } from './favorites/favorites.component';



@NgModule({
  declarations: [
    ProductDetailsComponent,
    ImageSliderComponent,
    RatingComponent,
    LikeProductComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
  ]
})
export class ProductsModule { }
