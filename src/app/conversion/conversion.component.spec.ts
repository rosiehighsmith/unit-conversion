import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ConversionComponent } from './conversion.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SystemResponse } from '../enums';
import { defaultFormControls, formControlsToValidate, temperatureConversionTestCases } from './conversion.test-data';

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

    xit('should display temp units in input/target units when temp conversion type', () => {

    });

    xit('should display volume units in input/target units when vol conversion type', () => {

    });
  });

  describe('isValidInput()', () => {
    formControlsToValidate.forEach((test) => {
      it(`should return "${test.expectedValue}" with inputValue "${test.inputValue}"
      for control "${test.control}"`, () => {
        const control = component.conversionForm.get(
          test.control
        ) as FormControl;

        control?.setValue(test.inputValue);
        const result = component.isValidInput(control);

        expect(result).toEqual(test.expectedValue);
      });
    });
  });

  describe('convertUnits()', () => {
    temperatureConversionTestCases.forEach((test) => {
      it(`should return "${test.expectedResult}" for
         ${test.inputValue} ${test.inputUnits.value} to ${test.targetUnits.value}`, () => {
        const result = component.convertUnits(
          Number(test.inputValue),
          test.inputUnits.value,
          test.targetUnits.value
        );

        expect(Number(result.toFixed(2))).toEqual(test.expectedResult);
      });
    });
  });

  describe('roundedAnswersMatch()', () => {
    it('should return true if answers match when rounded', () => {
      const controlValue = '9.67';
      const realAnswer = 9.66;
      const decimalPlace = 1;

      const control = component.studentResponseControl;

      control?.setValue(controlValue);
      const result = component.roundedAnswersMatch(
        realAnswer,
        Number(control.value),
        decimalPlace
      );

      expect(result).toEqual(
        true,
        `${controlValue} does not equal ${realAnswer} when rounded to ${decimalPlace} decimal`
      );
    });

    it('should return false if answers do not match when rounded', () => {
      const controlValue = '9.67';
      const realAnswer = 10;
      const decimalPlace = 1;

      const control = component.studentResponseControl;

      control?.setValue(controlValue);
      const result = component.roundedAnswersMatch(
        realAnswer,
        Number(control.value),
        decimalPlace
      );

      expect(result).toBe(
        false,
        `${controlValue} should not equal ${realAnswer} when rounded to ${decimalPlace} decimal`
      );
    });
  });

  describe('checkAnswer()', () => {
    it('should call isCorrectConversion() if text input controls are valid', () => {
      component.studentResponseControl?.setValue('20');
      component.inputValueControl?.setValue('40');
      spyOn(component, 'isCorrectConversion');
      spyOn(component, 'isValidInput').and.callThrough();

      component.checkAnswer();

      expect(component.isCorrectConversion).toHaveBeenCalled();
      expect(component.isValidInput).toHaveBeenCalledWith(component.studentResponseControl);
      expect(component.isValidInput).toHaveBeenCalledWith(component.inputValueControl);
    });

    it('should return invalid response if text input controls are not valid', () => {
      component.studentResponseControl?.setValue('BOOOOO');
      component.inputValueControl?.setValue('40');
      spyOn(component, 'isCorrectConversion');

      component.checkAnswer();

      expect(component.result).toEqual(SystemResponse.Invalid);
      expect(component.isCorrectConversion).not.toHaveBeenCalled();
    });
  });

  describe('isCorrectConversion()', () => {
    it('should call convertUnits()', () => {
      spyOn(component, 'convertUnits').and.callThrough();

      component.isCorrectConversion();

      expect(component.convertUnits).toHaveBeenCalled();
    });

    xit('should return correct response if roundedAnswersMatch()', () => {
      spyOn(component, 'roundedAnswersMatch').and.returnValue(true);

      component.isCorrectConversion();
      fixture.detectChanges();

      expect(component.roundedAnswersMatch).toHaveBeenCalled();
      expect(component.result).toEqual(SystemResponse.Correct);
    });

    xit('should return incorrect response if rounded answers do not match', () => {
      spyOn(component, 'roundedAnswersMatch').and.returnValue(false);

      component.isCorrectConversion();
      fixture.detectChanges();

      expect(component.roundedAnswersMatch).toHaveBeenCalled();
      expect(component.result).toEqual(SystemResponse.Incorrect);
    });
  });

  describe('pickInputUnits(), pickTargetUnits', () => {
    // updates the conversionForm
    xit('should update conversionForm.targetUnits', () => {
      expect(component.targetUnitsControl?.value).toEqual('');
      component.pickTargetUnits('degK');
      console.log('*****', component.targetUnitsControl);

      expect(component.targetUnitsControl?.value).toEqual('degK');
    });

    xit('should call convertUnits()', () => {
      spyOn(component, 'convertUnits').and.callThrough();

      component.isCorrectConversion();

      expect(component.convertUnits).toHaveBeenCalled();
    });
  });
});
