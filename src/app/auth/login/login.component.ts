import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarComponent } from 'src/app/shared-module/snackbar/snackbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  submitted = false;
  starCount = new Array(500); // Number of stars

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService,private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      password: ['', Validators.required]
    })
   
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    } else {
      const payload = {
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value
      }
      this.api.apiPostCall(payload, 'login').subscribe(data => {
        if(data.data.accessToken){
          localStorage.setItem('token', data.data.accessToken)
          this.router.navigate(['/user/home'])  
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: 'LoggedIn Successfully',
          });
        }else{
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: 'Failed to LoggedIn',
          }); 
        }
      },error=>{
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: error,
        });
      })
    }
  }

  ngOnDestroy() {

  }
}
