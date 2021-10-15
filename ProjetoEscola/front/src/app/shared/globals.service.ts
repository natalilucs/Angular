import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Student } from './aluno.model';

@Injectable()
export class Globals {
  sharedStudent: Student = new Student();
  state = new Subject<any>();

  setState(){
    this.state.next({
      value: this.sharedStudent
    })
  }
}