import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentService, Globals } from 'src/app/shared';
import { Student } from 'src/app/shared/aluno.model';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit {

  students: Student[]
  unsubscribe$: Subject<any> = new Subject()

  constructor(private studentService: StudentService, private snackbar: MatSnackBar, private globals: Globals) {
  }
  ngOnInit(): void {
    this.studentService.get().pipe(takeUntil(this.unsubscribe$)).subscribe((studs) => {
      this.students = studs;
    })
  }

  edit(student: Student) {
    this.changedRole(student)
    this.globals.setState()
    this.notify('EDITING!')
  }

  delete(student: Student) {
    this.studentService.del(student)
      .subscribe(
        () => this.notify('REMOVED!'),
        (err) => this.notify(err.error.msg)
      )
  }

  notify(msg: string) {
    this.snackbar.open(msg, "OK", { duration: 3000 })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
  }

 
   changedRole(student:Student) {
    this.globals.sharedStudent = student;
    this.globals.setState()
    console.log(this.globals.sharedStudent)
  }
}