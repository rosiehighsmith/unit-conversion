import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TemperatureUnit, VolumeUnit, SystemResponse } from '../enums';
import { InputDisplay } from './conversion.model';
import { UnitService } from '../services/unit.service';

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

  temperatureInputUnits: InputDisplay[] = [
    { value: 'degC', displayValue: TemperatureUnit.Celsius },
    { value: 'degF', displayValue: TemperatureUnit.Fahrenheit },
    { value: 'K', displayValue: TemperatureUnit.Kelvin },
    { value: 'degR', displayValue: TemperatureUnit.Rankine },
  ];

  volumeInputUnits: InputDisplay[] = [
    { value: 'cuft', displayValue: VolumeUnit.CubicFeet },
    { value: 'cuin', displayValue: VolumeUnit.CubicInches },
    { value: 'cup', displayValue: VolumeUnit.Cups },
    { value: 'gallon', displayValue: VolumeUnit.Gallons },
    { value: 'litre', displayValue: VolumeUnit.Liters },
    { value: 'tablespoon', displayValue: VolumeUnit.Tablespoons },
  ];

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
