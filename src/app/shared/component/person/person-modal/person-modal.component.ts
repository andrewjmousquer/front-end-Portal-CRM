import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { Person } from '../../../model/person.model';

@Component({
  selector: 'wbp-person-modal',
  templateUrl: './person-modal.component.html'
})
export class PersonModalComponent implements OnInit {

  @Input() personRegister: Person;
  @Input() disabled: boolean;
  @Output() onComplete: EventEmitter<Person> = new EventEmitter();
  @Output() getPersonInitCustom: EventEmitter<Person> = new EventEmitter();

  displayModal: boolean;
  personRegisterCopy: Person;

  constructor() { }

  ngOnInit() {
    this.personRegisterCopy = _.clone(this.personRegister);
  }

  openModal() {
    this.displayModal = true;
    this.getPersonInitCustom.emit();
    this.personRegisterCopy = _.clone(this.personRegister);
  }

  closeModal(person: Person) {
    this.displayModal = false;
    this.onComplete.emit(person);
  }

  cancelModal() {
    this.displayModal = false;
  }

  isDisabled() {
    return this.disabled;
  }
}
