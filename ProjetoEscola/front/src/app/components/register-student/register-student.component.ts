import { Student, StudentService, Globals } from '../../shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})


export class RegisterStudentComponent implements OnInit {

  @ViewChild("myForm", { static: true }) myForm: NgForm

  students: Student[]
  studentEdit: Student = new Student();

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private studentService: StudentService, private snackbar: MatSnackBar, private globals: Globals) {

  }

  ngOnInit(): void {
    /**Every time state is updated, do this:
         *  */
    this.globals.state.subscribe((state) => {
      this.studentEdit = state.value;
      console.log("SET STATE DETECTED!!!")
      console.log(this.studentEdit)
    });

    this.studentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(students => this.students = students)
  }

  save() {
    console.log("=============================")
    console.log("SAVING: ")
    console.log(this.studentEdit)
    console.log("=============================")

    if (this.studentEdit._id != "") {
      this.studentService.update(this.studentEdit).subscribe(
        (student) => {
          this.notify('UPDATED')
        },
        (err) => {
          this.notify('UPDATE ERROR');
          console.error(err)
        }
      )
    } else {
      this.studentService.add(this.studentEdit)
        .subscribe(
          (student) => {
            this.notify('INSERTED!');
          },
          (err) => {
            this.notify('ADD ERROR');
            console.error(err);
          }
        )
    }
    this.clearFields()
  }

  clearFields() {
    this.changedRole(new Student())
    this.ngOnDestroy()
    this.ngOnInit()
  }

  notify(msg: string) {
    this.snackbar.open(msg, "OK", { duration: 3000 })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
  }

  private changedRole(student: Student) {
    this.globals.sharedStudent = student;
  }
}