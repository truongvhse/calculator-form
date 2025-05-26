import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { evaluate } from 'mathjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
})
export class AppComponent {
  private _fb = inject(FormBuilder);
  keypadButtons = [
    { label: '←', action: () => this.removeLastToken() },
    { label: '(' },
    { label: ')' },
    { label: '*' },
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: '-' },
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '+' },
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '/' },
    { label: '0' },
    { label: '.' },
  ];
  result: number | string = '';
  formulaTokens: string[] = [];
  form = this._fb.group({
    variables: this._fb.array([this.createVar('a'), this.createVar('b')]),
    formula: new FormControl('', Validators.required),
  });
  createVar(label: string = ''): FormGroup {
    return this._fb.group({
      label: new FormControl(label, [Validators.required]),
      value: new FormControl(0, [Validators.required]),
    });
  }
  insertToken(token: string) {
    this.formulaTokens.push(token);
  }
  removeLastToken() {
    this.formulaTokens.pop();
  }
  get variables(): FormArray {
    return this.form.get('variables') as FormArray;
  }

  addVariable() {
    this.variables.push(this.createVar());
  }

  removeVariable(index: number) {
    this.variables.removeAt(index);
  }

  calculateFromTokens() {
    const expression = this.formulaTokens.join('');
    try {
      const scope = Object.fromEntries(
        (this.form.value.variables ?? []).map((v: any) => [v.label, v.value])
      );
      this.result = evaluate(expression, scope);
    } catch (e) {
      this.result = 'Invalid formula';
    }
  }
}
