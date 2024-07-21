// tests/LazyLoad.test.ts

import { LazyLoad } from '../../src/optimization';

class TestClass {
    @LazyLoad()
    heavyComputation() {
        console.log('Performing heavy computation...');
        return { data: 'Computed data' };
    }
}

describe('LazyLoad Decorator', () => {
    it('should perform heavy computation only once', () => {
        const testInstance = new TestClass();
        const consoleSpy = jest.spyOn(console, 'log');
        
        const result1 = testInstance.heavyComputation();
        expect(result1).toEqual({ data: 'Computed data' });
        expect(consoleSpy).toHaveBeenCalledWith('Performing heavy computation...');
        
        const result2 = testInstance.heavyComputation();
        expect(result2).toEqual({ data: 'Computed data' });
        expect(consoleSpy).toHaveBeenCalledTimes(1); // Only called once

        consoleSpy.mockRestore();
    });

    it('should return the same result on subsequent calls', () => {
        const testInstance = new TestClass();
        
        const result1 = testInstance.heavyComputation();
        const result2 = testInstance.heavyComputation();
        
        expect(result1).toBe(result2); // The same object reference should be returned
    });
});
