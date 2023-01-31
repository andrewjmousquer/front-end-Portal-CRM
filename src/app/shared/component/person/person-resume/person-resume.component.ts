import { Component, Input, OnInit } from '@angular/core';
import * as _ from "lodash";
import { PersonClassificationDictionary } from 'src/app/shared/dictionary/person-classification.dictionary';
import { ContactEnum } from 'src/app/shared/enum/contact-enum';
import { PersonClassifierEnum } from 'src/app/shared/enum/person-classifier-enum';
import { Classifier } from 'src/app/shared/model/classifier.model';
import { Contact } from 'src/app/shared/model/contact.model';
import { Person } from 'src/app/shared/model/person.model';
import { PhonePipe } from 'src/app/shared/pipe/phone.pipe';

@Component({
  selector: 'wbp-person-resume',
  templateUrl: './person-resume.component.html'
})
export class PersonResumeComponent implements OnInit {

  @Input() personRegister: Person;

  personClassifierEnum: any = PersonClassifierEnum;
  personClassificationList: Classifier[] = PersonClassificationDictionary;

  constructor(private phonePipe: PhonePipe) { }

  ngOnInit() {
  }

  showContact(contact: Contact){
    if(contact){
      if(contact.type.value == ContactEnum.CELULAR || contact.type.value == ContactEnum.TELEFONE){
        return this.phonePipe.transform(contact.value) + ' ' + (contact.complement ? contact.complement : '');
      } else {
        return contact.value + ' ' + (contact.complement ? contact.complement : '');
      }
    }
  }
}
