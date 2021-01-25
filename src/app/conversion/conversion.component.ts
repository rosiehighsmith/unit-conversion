import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {  SystemResponse } from '../enums';
import { temperatureInputUnits, volumeInputUnits } from './input-units';

import { unit } from 'mathjs';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss'],
})
export class ConversionComponent implements OnInit {
  conversionTypeForm: FormGroup = new FormGroup({});
  conversionForm: FormGroup = new FormGroup({});
  result = '';
  temperatureSelectOptions = temperatureInputUnits;
  volumeSelectOptions = volumeInputUnits;

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
  get studentResponseControl(): FormControl {
    return this.conversionForm.get('studentResponse') as FormControl;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.conversionTypeForm = this.fb.group({
      conversionType: 'temperature',
    });

    this.conversionForm = this.fb.group({
      conversionTypeForm: this.conversionTypeForm,
      inputValue: ['', Validators.required],
      inputUnits: ['', Validators.required],
      targetUnits: ['', Validators.required],
      studentResponse: ['', Validators.required],
    });
  }

  checkAnswer(): void {
    if (
      !this.isValidInput(this.studentResponseControl) ||
      !this.isValidInput(this.inputValueControl)
    ) {
      this.result = SystemResponse.Invalid;
      return;
    } else {
      this.result = this.isCorrectConversion();
    }
  }

  isValidInput(control: FormControl): boolean {
    return !isNaN(Number(control.value));
  }

  isCorrectConversion(): string {
    const realAnswer = this.convertUnits(
      this.inputValueControl.value,
      this.inputUnitsControl.value,
      this.targetUnitsControl.value
    );

    if (
      this.roundedAnswersMatch(
        Number(realAnswer),
        Number(this.studentResponseControl.value),
        1
      )
    ) {
      return SystemResponse.Correct;
    }
    return SystemResponse.Incorrect;
  }

  convertUnits(
    inputValue: number,
    inputUnits: string,
    targetUnits: string
  ): number {
    return unit(`${inputValue} ${inputUnits}`)?.toNumber(targetUnits);
  }

  roundedAnswersMatch(
    realAnswer: number,
    studentAnswer: number,
    decimalPoints: number
  ): boolean {
    return (
      realAnswer.toFixed(decimalPoints) === studentAnswer.toFixed(decimalPoints)
    );
  }

  pickInputUnits(value: any): void {
    this.conversionForm.patchValue({
      inputUnits: value,
    });
  }

  pickTargetUnits(value: any): void {
    this.conversionForm.patchValue({
      targetUnits: value,
    });
  }
}
