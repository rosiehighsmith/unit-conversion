import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ConversionComponent } from '../conversion.component';
import { SystemResponse } from '../../enums';
import {
  correctCompletedForm,
  defaultFormControls,
  formControlsToValidate,
  incorrectCompletedForm,
  invalidCompletedForm,
  temperatureConversionTestCases,
} from './conversion.test-data';

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
      expect(component.isValidInput).toHaveBeenCalledWith(
        component.studentResponseControl
      );
      expect(component.isValidInput).toHaveBeenCalledWith(
        component.inputValueControl
      );
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

    it('should return correct response if roundedAnswersMatch()', () => {
      spyOn(component, 'roundedAnswersMatch').and.returnValue(true);

      component.isCorrectConversion();

      expect(component.roundedAnswersMatch).toHaveBeenCalled();
      expect(component.isCorrectConversion()).toBe(SystemResponse.Correct);
    });

    it('should return incorrect response if rounded answers do not match', () => {
      spyOn(component, 'roundedAnswersMatch').and.returnValue(false);

      component.isCorrectConversion();

      expect(component.roundedAnswersMatch).toHaveBeenCalled();
      expect(component.isCorrectConversion()).toBe(SystemResponse.Incorrect);
    });
  });

  describe('pickInputUnits(), pickTargetUnits', () => {
    it('should update conversionForm.targetUnits', () => {
      component.pickTargetUnits('K');
      fixture.detectChanges();

      expect(component.conversionForm.get('targetUnits')?.value).toEqual('K');
    });

    it('should update conversionForm.inputUnits', () => {
      component.pickInputUnits('K');
      fixture.detectChanges();

      expect(component.conversionForm.get('inputUnits')?.value).toEqual('K');
    });
  });

  describe('UI', () => {
    it('should display a form', () => {
      const conversionForm = debugElement.query(By.css('#conversion_form'));

      expect(conversionForm).not.toBeNull();
    });

    it('should show "correct" if checkAnswer() returns with correct response', () => {
      component.conversionForm.setValue(correctCompletedForm);
      component.checkAnswer();

      expect(component.result).toEqual(SystemResponse.Correct);
    });

    it('should show "incorrect" if checkAnswer() returns with incorrect response', () => {
      component.conversionForm.setValue(incorrectCompletedForm);
      component.checkAnswer();

      expect(component.result).toEqual(SystemResponse.Incorrect);
    });

    it('should show "invalid" if checkAnswer() returns with invalid response', () => {
      component.conversionForm.setValue(invalidCompletedForm);
      component.checkAnswer();

      expect(component.result).toEqual(SystemResponse.Invalid);
    });

    defaultFormControls.forEach((test) => {
      it(`should contain ${test.expectedValue} for ${test.formControlName} form field by default`, () => {
        expect(
          component.conversionForm.get(test.formControlName)?.value
        ).toEqual(test.expectedValue);
      });
    });

    it('submit button should be disabled when form is invalid', () => {
      const checkAnswerButton = fixture.debugElement.query(
        By.css('button[type=submit]')
      );

      expect(component.conversionForm.valid).toBe(
        false,
        'form should be invalid when form is blank'
      );
      expect(checkAnswerButton.properties.disabled).toBe(true);
    });

    it('submit button should be enabled when form is valid', () => {
      const checkAnswerButton = fixture.debugElement.query(
        By.css('button[type=submit]')
      );

      component.conversionForm.setValue(correctCompletedForm);
      fixture.detectChanges();

      expect(component.conversionForm.valid).toBe(
        true,
        'form should be valid when form is filled out'
      );
      expect(checkAnswerButton.properties.disabled).toBe(false);
    });

    it('should display temperature and volume radio buttons to choose conversion type', () => {
      const conversionTypeRadioButtons = debugElement.queryAll(
        By.css('.conversion_type')
      );

      const temperatureRadiobutton = debugElement.queryAll(
        By.css('input[value="temperature"]')
      )[0];
      const volumeRadiobutton = debugElement.queryAll(
        By.css('input[value="temperature"]')
      )[0];

      expect(conversionTypeRadioButtons.length).toBe(2);
      expect(temperatureRadiobutton).not.toBeNull();
      expect(volumeRadiobutton).not.toBeNull();
    });

    it('should display correct units in input/target units when temperature conversion type', () => {
      component.conversionTypeControl.setValue('temperature');
      fixture.detectChanges();

      const temperatureInputOptions = debugElement.queryAll(
        By.css('#temperature_select_input option')
      );
      const temperatureTargetOptions = debugElement.queryAll(
        By.css('#temperature_select_target option')
      );

      expect(temperatureInputOptions.length).toBe(4);
      expect(temperatureTargetOptions.length).toBe(4);

      for (let index = 0; index < temperatureInputOptions.length; index++) {
        const option = temperatureInputOptions[index];
        expect(option.nativeElement.label).toBe(
          component.temperatureSelectOptions[index].displayValue
        );
      }

      for (let index = 0; index < temperatureTargetOptions.length; index++) {
        const option = temperatureTargetOptions[index];
        expect(option.nativeElement.label).toBe(
          component.temperatureSelectOptions[index].displayValue
        );
      }
    });

    it('should display correct units in input/target units when volume conversion type', () => {
      component.conversionTypeControl.setValue('volume');
      fixture.detectChanges();

      const volumeSelectOptions = debugElement.queryAll(
        By.css('#volume_select_input option')
      );
      const volumeTargetOptions = debugElement.queryAll(
        By.css('#volume_select_target option')
      );

      expect(volumeSelectOptions.length).toBe(6);
      expect(volumeTargetOptions.length).toBe(6);

      for (let index = 0; index < volumeSelectOptions.length; index++) {
        const option = volumeSelectOptions[index];
        expect(option.nativeElement.label).toBe(
          component.volumeSelectOptions[index].displayValue
        );
      }

      for (let index = 0; index < volumeTargetOptions.length; index++) {
        const option = volumeTargetOptions[index];
        expect(option.nativeElement.label).toBe(
          component.volumeSelectOptions[index].displayValue
        );
      }
    });
  });
});
