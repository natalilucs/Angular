import { Student } from './aluno.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  readonly url = 'http://localhost:8000/students';

  private studentsSubject$: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>(null);

  private loaded: boolean = false;

  constructor(private http: HttpClient) { }


  get(): Observable<Student[]> {
    if (!this.loaded) {
      this.http.get<Student[]>(this.url)
        .pipe(
          tap(students => console.log(students)),
          delay(1000)
        )
        .subscribe(this.studentsSubject$);
      this.loaded = true
    }
    return this.studentsSubject$.asObservable();
  }

  add(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student)
    .pipe(
      tap((_student: Student) => this.studentsSubject$.getValue().push(_student))
    )
  }

  del(student: Student): Observable<any> {
    return this.http.delete(`${this.url}/${student._id}`)
      .pipe(
        tap(() => {
          let students = this.studentsSubject$.getValue();
          let i = students.findIndex(_student => _student._id === student._id);
          if (i >= 0) {
            students.splice(i, 1)
          }
        })
      )
  }


  update(student: Student): Observable<Student> {
    console.log(
      this.http.patch<Student>(`${this.url}/${student}`, student)
    )
    return this.http.patch<Student>(`${this.url}/${JSON.stringify(student)}`, student)
      .pipe(
        tap(temp_student => {
          let students = this.studentsSubject$.getValue();
          let index = students.findIndex(_student => _student._id === student._id);
          if (index >= 0) {
            students[index].name = temp_student.name
            students[index].matriculation = temp_student.matriculation
            students[index].g1 = temp_student.g1
            students[index].g2 = temp_student.g2
            students[index].g3 = temp_student.g3
          }
        })
      )
  }

}

