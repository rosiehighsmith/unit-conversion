import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss'],
})
export class ConversionComponent implements OnInit {
  conversionTypeForm: FormGroup;
  conversionForm: FormGroup;
  result = '';

  get conversionTypeControl(): FormControl {
    return this.conversionTypeForm.get('conversionType') as FormControl;
  }

  get inputValueControl(): FormControl {
    return this.conversionForm.get('inputValue') as FormControl;
  }
  get inputUnitsControl(): FormControl {
    return this.conversionForm.get('inputUnits') as FormControl;
  }
  get targetUnitsControl(): FormControl {
    return this.conversionForm.get('targetUnits') as FormControl;
  }
  get studentInputControl(): FormControl {
    return this.conversionForm.get('studentInput') as FormControl;
  }

  temperatureInputUnits: string[] = ['C', 'F', 'K', 'R'];
  volumeInputUnits: string[] = ['L', 'Tb', 'Cubic In', 'c', 'Cubic Ft', 'Gal'];

  constructor(private fb: FormBuilder) {
    this.conversionTypeForm = this.fb.group({
      conversionType: 'temperature',
    });

    this.conversionForm = this.fb.group({
      conversionTypeForm: this.conversionTypeForm,
      inputValue: [''],
      inputUnits: [''],
      targetUnits: [''],
      studentInput: ['']
    });
  }

  ngOnInit(): void {}

  checkAnswer(): void {
    if (
      this.isValidInput(this.studentInputControl) ||
      this.isValidInput(this.inputValueControl)
    ) {
      this.result = 'invalid';
      return;
    } else {
      this.result = this.isCorrectConversion();
    }
  }

  isValidInput(control: FormControl): boolean {
    return !isNaN(Number(control.value));
  }

  isCorrectConversion(): string {
    const realAnswer = this.convert(this.inputUnitsControl.value, this.targetUnitsControl.value);

    if (this.roundedAnswersMatch(realAnswer, Number(this.studentInputControl.value), 1)) {
      return 'correct';
    }
    return 'incorrect';
  }

  roundedAnswersMatch(realAnswer: number, studentAnswer: number, decimalPoints: number): boolean {
    return realAnswer.toFixed(decimalPoints) === studentAnswer.toFixed(decimalPoints);
  }

  convert(inputUnits: string, targetUnits: string): number {
    return 9.66;
  }

  pickInputUnits(event: any): void {
    this.conversionForm.patchValue({
      inputUnits: event.target.value,
    });
  }

  pickTargetUnits(event: any): void {
    this.conversionForm.patchValue({
      targetUnits: event.target.value,
    });
  }

  clearForm(): void {
    this.conversionForm.reset();
    this.result = ''; // todo: why isn't this updating the UI?
  }
}
