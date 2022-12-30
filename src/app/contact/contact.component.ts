import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { expand, flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [flyInOut(), expand()]
})
export class ContactComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;

  formErrors: any = {
    'firstName': '',
    'lastName': '',
    'telNum': '',
    'email': ''
  };

  validationMessages: any = {
    'firstName': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength': 'FirstName cannot be more than 25 characters long.'
    },
    'lastName': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be at least 2 characters long.',
      'maxlength': 'Last Name cannot be more than 25 characters long.'
    },
    'telNum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    },
  };

  @ViewChild('fBackForm') feedbackFormDirective: { resetForm: () => void; } | undefined
  errMessage: any;
  feedBackSubmitted: boolean = false;
  feedbackInitiated: boolean = false;

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telNum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contactType: 'None',
      message: ''
    })
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedBackSubmitted = false;
    this.feedbackInitiated = true;
    this.feedbackService.submitFeedback(this.feedback).subscribe({
      next: feedBack => {
        this.feedBackSubmitted = true;
        this.feedbackInitiated = false;
        this.feedback = feedBack;
        setTimeout(() => {
          this.feedBackSubmitted = false;
        }, 5000);
      },
      error: errMessage => this.errMessage = <any>errMessage
    })
    this.feedbackForm.reset({
      firstName: '',
      lastName: '',
      telNum: '',
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });
    this.feedbackFormDirective?.resetForm();
  }
}
