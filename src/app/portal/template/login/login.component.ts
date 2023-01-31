import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Message } from 'primeng/api';

import { AppComponent } from '../../../app.component';

import { AuthenticationService } from '../../../shared/service/authentication.service';

import { UserService } from '../../../shared/service/user.service';

import { User } from 'src/app/shared/model/user.model';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { systemEnvironment } from 'src/environments/system-environment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'wbp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  showExpiredPasswordDialog = false;

  loginForm: FormGroup;
  userLogin: User;
  user: User;
  expirePasswordForm: any;

  title: string;
  version: string;
  versionDate: string;
  envinromentName: string;

  returnUrl: string;
  error = '';

  msgs: Message[] = [];
  expiredPasswordMessages: Message[] = [];

  jasperLogoutURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.jasper}/logout.html`);

  constructor(
    public app: AppComponent,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private sanitizer: DomSanitizer) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
    if (this.app.msgs && this.app.msgs.length > 0) {
      this.msgs = this.app.msgs;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    this.expirePasswordForm = {
      data: null,
      password: null,
      confirmPassword: null
    };


    this.title = systemEnvironment.systemName;
    this.version = systemEnvironment.versionNumber;
    this.versionDate = systemEnvironment.versionDate;
    this.envinromentName = environment.environmentName;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.expirePass === true) {
            this.expirePasswordForm.data = data;
            this.showExpiredPasswordDialog = true;
          } else {
            if (data.accessList != null) {
              if (data.accessList.defaultMenu != null) {
                this.router.navigate([data.accessList.defaultMenu.route]);
              } else {
                this.router.navigate([this.returnUrl]);
              }
            } else {
              this.router.navigate([this.returnUrl]);
            }
          }
        },
        error => {
          if (error == null || error == undefined || error == "Unknown Error") {
            this.error = "Não foi possível efetuar login, contate o administrador"
          } else {
            this.error = error;
          }

          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Erro', detail: this.error });
          this.loading = false;
        });
  }

  changePassword() {
    this.expiredPasswordMessages = [];
    if (this.expirePasswordForm.password == "" || this.expirePasswordForm.password == undefined || this.expirePasswordForm.password == null ||
      this.expirePasswordForm.confirmPassword == "" || this.expirePasswordForm.confirmPassword == undefined || this.expirePasswordForm.confirmPassword == null) {
      this.expiredPasswordMessages.push({ severity: 'info', summary: '', detail: 'Preencha todos os campos com valores válidos' });
      return;
    } else if (this.expirePasswordForm.password != this.expirePasswordForm.confirmPassword) {
      this.expiredPasswordMessages.push({ severity: 'info', summary: '', detail: 'As senhas devem ser iguais' });
      return;
    }

    let user = new User();
    user.id = this.expirePasswordForm.data.id;
    user.password = this.expirePasswordForm.password;

    this.userService.changePassword(user).pipe(first()).subscribe(data => {
      this.showExpiredPasswordDialog = false;
      if (this.expirePasswordForm.data.accessList != null) {
        if (this.expirePasswordForm.data.accessList.defaultMenu != null) {
          this.router.navigate([this.expirePasswordForm.data.accessList.defaultMenu.route]);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      } else {
        this.router.navigate([this.returnUrl]);
      }
    }, error => {
      this.expiredPasswordMessages.push({ severity: 'error', summary: '', detail: error });
      return;
    });
  }

  cancelChangePassword() {
    this.showExpiredPasswordDialog = false;
    this.app.logout();
  }
}
