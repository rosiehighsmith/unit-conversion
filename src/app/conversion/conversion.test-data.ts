export const defaultFormControls = [
  {
    formControlName: 'conversionTypeForm',
    expectedValue: { conversionType: 'temperature' },
  },
  { formControlName: 'inputValue', expectedValue: '' },
  { formControlName: 'inputUnits', expectedValue: '' },
  { formControlName: 'targetUnits', expectedValue: '' },
  { formControlName: 'studentResponse', expectedValue: '' },
];

export const formControlsToValidate = [
  { control: 'inputValue', inputValue: '2', expectedValue: true },
  { control: 'inputValue', inputValue: 'woof', expectedValue: false },
  { control: 'studentResponse', inputValue: '34', expectedValue: true },
  { control: 'studentResponse', inputValue: 'woof', expectedValue: false },
  { control: 'inputValue', inputValue: '', expectedValue: false },
  { control: 'studentResponse', inputValue: '', expectedValue: false },
];

export const temperatureConversionTestCases = [
  {
    inputValue: 32,
    inputUnits: { value: 'degF' },
    targetUnits: { value: 'degC' },
    expectedResult: 0,
  },
  {
    inputValue: 0,
    inputUnits: { value: 'degC' },
    targetUnits: { value: 'degF' },
    expectedResult: 32,
  },
  {
    inputValue: 0,
    inputUnits: { value: 'degC' },
    targetUnits: { value: 'degC' },
    expectedResult: 0,
  },
  {
    inputValue: 0,
    inputUnits: { value: 'degC' },
    targetUnits: { value: 'K' },
    expectedResult: 273.15,
  },
  {
    inputValue: 0,
    inputUnits: { value: 'degC' },
    targetUnits: { value: 'degR' },
    expectedResult: 491.67,
  },
  {
    inputValue: 10,
    inputUnits: { value: 'cuft' },
    targetUnits: { value: 'cuin' },
    expectedResult: 17280,
  },
  {
    inputValue: 10,
    inputUnits: { value: 'cuin' },
    targetUnits: { value: 'cup' },
    expectedResult: 0.69,
  },
  {
    inputValue: 10,
    inputUnits: { value: 'cup' },
    targetUnits: { value: 'gallon' },
    expectedResult: 0.62,
  },
  {
    inputValue: 10,
    inputUnits: { value: 'gallon' },
    targetUnits: { value: 'litre' },
    expectedResult: 37.85,
  },
  {
    inputValue: 10,
    inputUnits: { value: 'tablespoon' },
    targetUnits: { value: 'tablespoon' },
    expectedResult: 10,
  },
];
