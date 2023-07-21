import { InjectionToken } from "@angular/core";

export const API_ERROR = new InjectionToken('API_ERROR');

export const productCategories = ['Chairs', 'Beds', 'Sofas & armchairs', 'Tables', 'Storage furniture', 'Garden & outdoor', 'Bathroom', 'Desks', 'Accessories', 'Other'];

export class FileUpload {
  name!: string;
  url!: string;
  file: File;
  isLoading?: boolean;

  constructor(file: File) {
    this.file = file;
  }
};

export const loadingProduct = {
  _id: '',
  name: '',
  description: '',
  category: '',
  color: '',
  material: '',
  price: 0,
  discount: 0,
  quantity: 0,
  createdAt: '',
  updatedAt: '',
  images: [{
    key: '',
    name: '',
    url: ''
  }]
};

export const loadingReview = {
  _id: '',
  text: '',
  createdAt: '',
  updatedAt: '',
  likes: [],
  ownerId: {
    _id: '',
    firstName: '',
    lastName: ''
  },
  productId: ''
}

export const productSorting = [
  'Name',
  '-Name',
  'Price',
  '-Price',
  'Discount',
  '-Discount'
];

export const pageSize = 8;