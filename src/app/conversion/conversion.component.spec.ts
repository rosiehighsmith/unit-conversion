import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ConversionComponent } from './conversion.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
describe('ConversionComponent', () => {
  let component: ConversionComponent;
  let fixture: ComponentFixture<ConversionComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversionComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI', () => {
    it('should display a form', () => {
      const conversionForm = debugElement.query(By.css('#conversion_form'));

      expect(conversionForm).not.toBeNull();
    });

    const defaultFormControls = [
      {
        formControlName: 'conversionTypeForm',
        expectedValue: { conversionType: 'temperature' },
      },
      { formControlName: 'inputValue', expectedValue: '' },
      { formControlName: 'inputUnits', expectedValue: '' },
      { formControlName: 'targetUnits', expectedValue: '' },
      { formControlName: 'studentInput', expectedValue: '' },
    ];

    defaultFormControls.forEach((test) => {
      it(`should contain ${test.expectedValue} for ${test.formControlName} form field by default`, () => {
        expect(
          component.conversionForm.get(test.formControlName)?.value
        ).toEqual(test.expectedValue);
      });
    });

    it('should display temperature and volume radio buttons to choose conversion type', () => {
      const conversionTypeRadioButtons = debugElement.queryAll(
        By.css('.conversion_type')
      );

      const temperatureRadiobutton = debugElement.queryAll(
        By.css('.conversion_type')
      )[0];
      const volumeRadiobutton = debugElement.queryAll(
        By.css('.conversion_type')
      )[1];

      expect(conversionTypeRadioButtons.length).toBe(2);
      expect(temperatureRadiobutton).not.toBeNull();
      expect(volumeRadiobutton).not.toBeNull();
    });
  });

  fdescribe('isValidInput()', () => {
    const formControlsToValidate = [
      { control: 'inputValue', inputValue: '2', expectedValue: true },
      { control: 'inputValue', inputValue: 'woof', expectedValue: false },
      { control: 'studentInput', inputValue: '34', expectedValue: true },
      { control: 'studentInput', inputValue: 'woof', expectedValue: false },
    ];

    formControlsToValidate.forEach((test) => {
      it(`should return "${test.expectedValue}" with inputValue ${test.inputValue}
      for control "${test.control}"`, () => {
        const control = component.conversionForm.get(
          test.control
        ) as FormControl;

        control?.setValue(test.inputValue);
        const result = component.isValidInput(control);

        expect(result).toEqual(test.expectedValue);
      });
    });

    const temperatureConversionTestCases = [
      {
        inputValue: '123',
        inputUnits: '',
        targetUnits: '',
        studentInput: '',
        expectedResult: 'correct',
      },
      // { inputValue: '123', inputUnits: '', targetUnits: '', studentInput: '', expectedResult: 'incorrect'},
      // { inputValue: '123', inputUnits: '', targetUnits: '', studentInput: '', expectedResult: 'correct'},
    ];

    temperatureConversionTestCases.forEach((test) => {
      xit(`should return "${test.expectedResult}" with student answer "${test.studentInput}"
          for ${test.inputValue}${test.inputUnits} to ${test.targetUnits}`, () => {
        component.conversionForm.setValue({
          conversionTypeForm: { conversionType: 'temperature' },
          inputValue: test.inputValue,
          inputUnits: test.inputUnits,
          targetUnits: test.targetUnits,
          studentInput: test.studentInput,
        });
        component.checkAnswer();
        fixture.detectChanges();

        expect(component.result).toEqual(test.expectedResult);
      });

      // todo: check that checkAnswer calls isNotValidInput
      // maybe break out methods into separate describes rather than one giant checkAnswer
    });
  });

  fdescribe('roundedAnswersMatch()', () => {
    it('should return true if answers match when rounded', () => {
      const controlValue = '9.67';
      const realAnswer = 9.66;
      const decimalPlace = 1;

      const control = component.conversionForm.get(
        'studentInput'
      ) as FormControl;

      control?.setValue(controlValue);
      const result = component.roundedAnswersMatch(realAnswer, Number(control.value), decimalPlace);

      expect(result).toEqual(true, `${controlValue} does not equal ${realAnswer} when rounded to ${decimalPlace} decimal`);
    });

    it('should return false if answers do not match when rounded', () => {
      const controlValue = '9.67';
      const realAnswer = 10;
      const decimalPlace = 1;

      const control = component.conversionForm.get(
        'studentInput'
      ) as FormControl;

      control?.setValue(controlValue);
      const result = component.roundedAnswersMatch(realAnswer, Number(control.value), decimalPlace);

      expect(result).toBe(false, `${controlValue} should not equal ${realAnswer} when rounded to ${decimalPlace} decimal`);
    });
  });
});
