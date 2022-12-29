import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
  @Input() dish!: Dish;
  dishCopy!: Dish;

  visibility: string = 'shown';

  errMessage!: string;
  errMessageDish: any;
  errorMessageSave: any;

  dishIds!: string[];
  prev!: string;
  next!: string;

  commentForm!: FormGroup;
  comment!: Comment;
  formErrors: any = {
    'author': '',
    'comment': ''
  };

  value: any = 5;

  validationMessages: any = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 4 characters long.',
      'maxlength': 'Comment cannot be more than 100 characters long.'
    }
  };

  @ViewChild('refCommentForm') commentFormDirective: { resetForm: () => void; } | undefined

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: string
  ) {
    this.createForm();
  }

  ngOnInit() {
    // const id = +this.route.snapshot.params['id'];
    // console.log(id);
    // this.dishService.getDish(id).subscribe(dish => this.dish = dish);
    this.dishService.getDishIDs().subscribe({
      next: dishIds => this.dishIds = dishIds,
      error: errMessage => this.errMessageDish = <any>errMessage
    });
    this.route.params.pipe(
      switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id'])
      })
    ).subscribe({
      next: dish => {
        this.visibility = 'shown';
        this.dish = dish;
        this.dishCopy = dish;
        this.setPrevNext(dish.id)
      },
      error: errMessage => this.errMessage = <any>errMessage
    })

  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      date: new Date()
    })
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }


  onSubmit() {
    this.comment = this.commentForm.value;
    // this.dish.comments.push(this.comment);
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe({
      next: dish => {
        this.dish = dish; this.dishCopy = dish;
      },
      error: errorMessageSave => {
        this.dish = new Dish();
        this.dishCopy = new Dish();
        this.errorMessageSave = <any>errorMessageSave;
      }
    })
    this.commentForm.reset({
      author: '',
      range: 5,
      comment: '',
      date: new Date()
    });
    this.commentFormDirective?.resetForm();
    this.createForm();
  }
}
