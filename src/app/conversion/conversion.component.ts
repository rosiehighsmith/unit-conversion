import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TemperatureUnit, VolumeUnit, SystemResponse } from '../enums';
import { unit } from 'mathjs';
import { InputDisplay } from './conversion.model';

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
      inputValue: [''],
      inputUnits: [''],
      targetUnits: [''],
      studentResponse: [''],
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
    return control.value !== '' && !isNaN(Number(control.value));
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
    return unit(`${inputValue} ${inputUnits}`).toNumber(targetUnits);
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

  pickInputUnits(event: any): void {
    console.log('pickInputUnits event', event);

    this.conversionForm.patchValue({
      inputUnits: event.target.value,
    });
  }

  pickTargetUnits(event: any): void {
    console.log('event', event);

    this.conversionForm.patchValue({
      targetUnits: event.target.value,
    });
  }

  clearForm(): void {
    this.conversionForm.reset();
    this.result = '';
  }
}
