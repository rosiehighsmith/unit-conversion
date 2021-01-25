import { TemperatureUnit, VolumeUnit } from '../enums';
import { InputDisplay } from './conversion.model';

export const temperatureInputUnits: InputDisplay[] = [
  { value: 'degC', displayValue: TemperatureUnit.Celsius },
  { value: 'degF', displayValue: TemperatureUnit.Fahrenheit },
  { value: 'K', displayValue: TemperatureUnit.Kelvin },
  { value: 'degR', displayValue: TemperatureUnit.Rankine },
];

export const volumeInputUnits: InputDisplay[] = [
  { value: 'cuft', displayValue: VolumeUnit.CubicFeet },
  { value: 'cuin', displayValue: VolumeUnit.CubicInches },
  { value: 'cup', displayValue: VolumeUnit.Cups },
  { value: 'gallon', displayValue: VolumeUnit.Gallons },
  { value: 'litre', displayValue: VolumeUnit.Liters },
  { value: 'tablespoon', displayValue: VolumeUnit.Tablespoons },
];
