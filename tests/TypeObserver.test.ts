import { TypeObserver } from '../src/TypeObserver';
import { TypeLogger } from '../src/TypeLogger';

describe('TypeObserver', () => {

  // Mock the log function of TypeLogger
  let mockLog: jest.SpyInstance;
  beforeEach(() => {
    mockLog = jest.spyOn(TypeLogger, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockLog.mockRestore();
  });

  it('should allow subscribing to typeAdded event', () => {
    const observer = new TypeObserver();
    const callback = jest.fn();
    observer.on('typeAdded', callback);
    observer.addType('number');
    expect(callback).toHaveBeenCalledWith('number');
  });

  it('should allow subscribing to typeRemoved event', () => {
    const observer = new TypeObserver();
    const callback = jest.fn();
    observer.on('typeRemoved', callback);
    observer.removeType('number');
    expect(callback).toHaveBeenCalledWith('number');
  });

  it('should allow unsubscribing from events', () => {
    const observer = new TypeObserver();
    const callback = jest.fn();
    observer.on('typeAdded', callback);
    observer.off('typeAdded', callback);
    observer.addType('number');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should notify multiple subscribers for typeAdded', () => {
    const observer = new TypeObserver();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    observer.on('typeAdded', callback1);
    observer.on('typeAdded', callback2);
    observer.addType('number');
    expect(callback1).toHaveBeenCalledWith('number');
    expect(callback2).toHaveBeenCalledWith('number');
  });

  it('should notify multiple subscribers for typeRemoved', () => {
    const observer = new TypeObserver();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    observer.on('typeRemoved', callback1);
    observer.on('typeRemoved', callback2);
    observer.removeType('number');
    expect(callback1).toHaveBeenCalledWith('number');
    expect(callback2).toHaveBeenCalledWith('number');
  });

  it('should log the type addition using TypeLogger', () => {
    const observer = new TypeObserver();
    observer.addType('string');
    expect(mockLog).toHaveBeenCalledWith('Type added: string');
  });

  it('should log the type removal using TypeLogger', () => {
    const observer = new TypeObserver();
    observer.removeType('string');
    expect(mockLog).toHaveBeenCalledWith('Type removed: string');
  });

  for (let i = 1; i <= 10; i++) {
    it(`should notify for custom type CustomType${i} for typeAdded`, () => {
      const observer = new TypeObserver();
      const callback = jest.fn();
      observer.on('typeAdded', callback);
      observer.addType(`CustomType${i}`);
      expect(callback).toHaveBeenCalledWith(`CustomType${i}`);
    });

    it(`should notify for custom type CustomType${i} for typeRemoved`, () => {
      const observer = new TypeObserver();
      const callback = jest.fn();
      observer.on('typeRemoved', callback);
      observer.removeType(`CustomType${i}`);
      expect(callback).toHaveBeenCalledWith(`CustomType${i}`);
    });
  }
});
