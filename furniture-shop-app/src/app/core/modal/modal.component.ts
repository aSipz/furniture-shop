import { Component, Inject } from '@angular/core';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalTitle = data.title;
    this.modalText = data.text;
    this.modalImageUrl = data.imageUrl;
  }
}
