import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, tap, take } from 'rxjs';

import { orderSorting, orderStatus } from '../constants';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { PICK_FORMATS, PickDateAdapter } from '../datePicker-format';

const searchMap = {
  email(value: string) {
    return { '$regex': value, '$options': 'i' };
  },
  status(value: string) {
    return value;
  },
  amount(value: string) {
    const min = Math.min(...value.split(', ').map(e => +e));
    const max = Math.max(...value.split(', ').map(e => +e));
    return { $gte: min, $lte: max };
  },
  createdAt(value: string) {
    const [startDate, endDate] = value.split(', ');
    const dateSearch = {};

    startDate && Object.assign(dateSearch, { $gte: startDate });
    endDate && Object.assign(dateSearch, { $lte: endDate });
    return Object.values(dateSearch).length > 0 ? dateSearch : null;
  }
}


@Component({
  selector: 'app-orders-search-bar',
  templateUrl: './orders-search-bar.component.html',
  styleUrls: ['./orders-search-bar.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class OrdersSearchBarComponent implements AfterViewInit, OnDestroy {

  statuses: string[] = orderStatus;
  sorting: string[] = orderSorting;

  searchForm = this.fb.group({
    email: [''],
    status: [''],
    priceGroup: this.fb.group({
      price1: [0],
      price2: [100000],
    }),
    dateGroup: this.fb.group({
      startDate: new FormControl<Date | string>({ value: '', disabled: true }),
      endDate: new FormControl<Date | string>({ value: '', disabled: true }),
    }),
    order: ['-createdAt'],
  });

  query!: { [key: string]: any };

  subs: Subscription[] = [];

  get hasSelectedDate() {
    return Object.values(this.searchForm.get('dateGroup')?.value!).some(v => v);
  }

  @Input() adminPanel = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      take(1)
    ).subscribe(query => {
      this.query = query;

      const search = query['search'] ? JSON.parse(query['search']) : {};

      const email = search['email']?.['$regex'] ?? '';
      const status = search['status'] ?? '';
      const price1 = search['price']?.['$gte'] ?? '0';
      const price2 = search['price']?.['$lte'] ?? '100000';
      const startDate = search['createdAt']?.['$gte'] ? new Date(+search['createdAt']?.['$gte']) : '';
      const endDate = search['createdAt']?.['$lte'] ? new Date(+search['createdAt']?.['$lte']) : '';
      const order = query['sort'] ?? '-createdAt';
      const priceGroup = { price1, price2 };
      const dateGroup = { startDate, endDate };

      this.searchForm.patchValue({ email, status, priceGroup, order, dateGroup });

    });
  }

  ngAfterViewInit() {
    const emailSub = this.searchForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToSearch(value ? value : '', 'email');
        })
      )
      .subscribe();

    const statSub = this.searchForm.get('status')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToSearch(value ? value : '', 'status');
        })
      )
      .subscribe();

    const priceSub = this.searchForm.get('priceGroup')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        const valArr = Object.values(value).map(v => v ? v.toString() : '0');
        this.addToSearch(valArr.some(v => !['0', '100000'].includes(v)) ? valArr.join(', ') : '', 'amount');
      })
    ).subscribe()

    const dateSub = this.searchForm.get('dateGroup')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        console.log(Object.values(this.searchForm.get('dateGroup')?.value!).some(v => v));


        const valArr = Object.entries(value).map(v => {
          const date = v[1] ? Date.parse(v[1] as string) : null
          return date;
        });
        this.addToSearch(valArr.every(v => v === null) ? '' : valArr.join(', '), 'createdAt');

      })
    ).subscribe()

    const orderSub = this.searchForm.get('order')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToOrder(value ? value : '-createdAt');
        })
      )
      .subscribe();

    this.subs.push(emailSub!, statSub!, priceSub!, orderSub!, dateSub!);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private changeQueryParams(queryParams: Params) {

    for (const key in queryParams) {
      if (queryParams[key] === '{}') {
        queryParams[key] = null;
      }
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  private addToSearch(value: string, fieldName: keyof typeof searchMap) {
    if (value) {
      this.query = {
        ...this.query,
        search: JSON.stringify({
          ...JSON.parse(this.query['search'] ? this.query['search'] : '{}'),
          [fieldName]: searchMap[fieldName](value)
        }),
        skip: null,
        limit: null
      }
    } else {
      const { [fieldName]: _, skip, limit, ...newSearch } = JSON.parse(this.query['search'] ? this.query['search'] : '{}');
      this.query = {
        ...this.query,
        search: JSON.stringify(newSearch)
      }
    }
    this.changeQueryParams(this.query);
  }

  private addToOrder(value: string) {
    if (value && value !== 'email') {
      this.query = {
        ...this.query,
        sort: value
      }
    } else {
      const { sort, ...newQuery } = this.query;
      this.query = newQuery;
    }
    this.changeQueryParams(this.query);
  }

  clearDate() {
    this.searchForm.patchValue({ dateGroup: { startDate: '', endDate: '' } });
  }
}
