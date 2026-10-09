import { carZodSchema } from "../../model/car";

const validCar = {
  make: "Ford",
  model: "Focus",
  year: 1980,
};

describe('Test Car Validation', () => {
  it('should pass for valid data', () => {
    expect(() => carZodSchema.parse(validCar)).not.toThrow();
  });

  it('should pass for valid data - no year', () => {
    expect(() => carZodSchema.parse({ ...validCar, year: undefined })).not.toThrow();
  });

  it('should fail for too early a year', () => {
    expect(() => carZodSchema.parse({ ...validCar, year: 1949 })).toThrow();
  });

  it('should fail for an unparsable year', () => {
    expect(() => carZodSchema.parse({ ...validCar, year: 'wrong year' })).toThrow();
  });

  it('should fail for a missing make', () => {
    expect(() => carZodSchema.parse({ ...validCar, make: undefined })).toThrow();
  });

  it('should fail for a missing model', () => {
    expect(() => carZodSchema.parse({ ...validCar, model: undefined })).toThrow();
  });

  it('should fail for an empty model', () => {
    expect(() => carZodSchema.parse({ ...validCar, model: '' })).toThrow();
  });
});