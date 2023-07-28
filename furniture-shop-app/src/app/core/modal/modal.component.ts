import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  modalTitle: string;
  modalText: string;
  modalImageUrl: string;
  statusOptions: string[];

  form = this.fb.group({
    status: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.modalTitle = data.title;
    this.modalText = data.text;
    this.modalImageUrl = data.imageUrl;
    this.statusOptions = data.statusOptions;
  }
}
