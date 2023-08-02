# Angular furniture shop app

[The app](https://furniture-shop-df231.web.app/)

[GitHub Resources](https://github.com/aSipz/furniture-shop)

[Screenshots](https://github.com/aSipz/furniture-shop/screenshots)

## Overview

This is an application for online furniture shop. The app allows visitors to browse products in the shop. 

A visitor can register, which allows him to rate product, add review for product and edit or delete all his reviews, like other users reviews, add a product to his favorites list, add product to his cart, make a order, view a list with all his orders and edit his profile info.

Users with administrator rights additionally can add new products to shop, edit existing products, make products unavailable or delete them, view list of all clients orders.

The functionality for administrators can be tested with already initialized user:

email: vankata@gmail.com

pass: 1234

The app is developed with Angular and hosted on [Firebase](https://furniture-shop-df231.web.app/)

For uploading product images is used Firebase Storage.

The backend is developed with Express and deployed on [Render.com](https://render.com/)

For database is used [MongoDB Atlas](https://www.mongodb.com/atlas/database)

<details>

<summary>Home screen</summary>

![Home screen for visitor](https://github.com/aSipz/furniture-shop/blob/main/screenshots/01_home_guest.jpg)

</details>

## Functionality

In the application, you can:

<details>

<summary>Register</summary>

### Register

![Register](https://github.com/aSipz/furniture-shop/blob/main/screenshots/03_register.jpg)

There are validations implemented on frontend and backend for email, username, first name, last name and passwords.

There can't be users with same email or username.

</details>

<details>

<summary>Login</summary>

### Login

![Login](https://github.com/aSipz/furniture-shop/blob/main/screenshots/04_login.jpg)

There are validations implemented on frontend and backend for email and password.

</details>

<details>

<summary>View, edit and delete profile</summary>

### View, edit and delete profile

Every user can:

![View profile](https://github.com/aSipz/furniture-shop/blob/main/screenshots/05_profile.jpg)

![Edit profile and password](https://github.com/aSipz/furniture-shop/blob/main/screenshots/06_edit_profile.jpg)

Delete his profile.

</details>

<details>

<summary>Browse shop</summary>

### Browse shop

![Browse shop](https://github.com/aSipz/furniture-shop/blob/main/screenshots/02_shop.jpg)

Every visitor can view, search available products by name, category or price and order them by name, price or discount.

Registered users can add products to cart by pressing add button.

Users with administrator rights additionally can view products which are marked unavailable.

Registered user have a section with all his favorites including products, which are currently unavailable and can search and order them.

</details>

<details>

<summary>View product details</summary>

### View product details

Every visitor can view product details, rating and reviews.

Registered users can additionally rate the product, add/remove it from their favorites, add review, edit/delete their reviews, like other users reviews, add the product to their cart.

![Product details for registered user](https://github.com/aSipz/furniture-shop/blob/main/screenshots/07_product_details.jpg)

Users with administrator rights can additionally make product unavailable/available, delete or navigate to edit page.

![Product details for administrator](https://github.com/aSipz/furniture-shop/blob/main/screenshots/12_product_details_admin.jpg)

</details>

<details>

<summary>View cart</summary>

### Cart

Registered users can add, remove or change count of products in their cart. Every time when there is a change in cart, available quantities are checked and maximum count restriction is applied.

![Cart](https://github.com/aSipz/furniture-shop/blob/main/screenshots/08_cart.jpg)

</details>

<details>

<summary>View checkout</summary>

### Checkout

On checkout page user should enter address, phone and optionally notes for order. After the order is placed, a check for available quantities is made. If they are not enough
an error is shown. After successful order the available product quantities are updated and the order is visible in the list with orders.

![Checkout](https://github.com/aSipz/furniture-shop/blob/main/screenshots/09_checkout.jpg)

</details>

<details>

<summary>View orders</summary>

### View orders

Every registered user has access to a section with all his orders, where he can search them by status, total amount, order date and sort them by date ot total amount.

If user's order is with status "Received" or "Processing" he can cancel order and ordered products' quantities will be added to available quantities for each product.

![Orders details](https://github.com/aSipz/furniture-shop/blob/main/screenshots/10_my_orders.jpg)

An administrator has access to a list of all clients orders and can change their statuses.

![All orders](https://github.com/aSipz/furniture-shop/blob/main/screenshots/14_clients_orders.jpg)

</details>

<details>

<summary>Add new product</summary>

### Add new product

An administrator can add new product. There can't be products with same name. There are validations implemented on frontend and backend for name, description, category, quantity, color, material, price. Every product should have at least one image.

![Add product](https://github.com/aSipz/furniture-shop/blob/main/screenshots/11_add_new_product.jpg)

</details>

<details>

<summary>Edit existing product</summary>

### Edit existing product

An administrator can edit all products. There are validations implemented on frontend and backend for name, description, category, quantity, color, material, price. Every product should have at least one image.

![Edit product](https://github.com/aSipz/furniture-shop/blob/main/screenshots/13_edit_product.jpg)

</details>