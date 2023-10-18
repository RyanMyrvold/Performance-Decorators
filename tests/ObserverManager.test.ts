import { ObserverManager } from '../src/ObserverManager';
import { TypeObserver } from '../src/TypeObserver';
import { TypeLogger } from '../src/TypeLogger';

describe('ObserverManager', () => {
  beforeEach(() => {
    ObserverManager['observerMap'].clear();
    jest.spyOn(TypeLogger, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('addObserver', () => {
    it('should add a new observer to the observer map', () => {
      const observer: TypeObserver = new TypeObserver();
      ObserverManager.addObserver('testObserver', observer);
      expect(ObserverManager['observerMap'].size).toBe(1);
      expect(ObserverManager['observerMap'].get('testObserver')).toBe(observer);
    });

    it('should log a message to the console', () => {
      const observer: TypeObserver = new TypeObserver();
      ObserverManager.addObserver('testObserver', observer);
      expect(TypeLogger.log).toHaveBeenCalledWith('Added new observer: testObserver');
    });
  });

  describe('removeObserver', () => {
    it('should remove an existing observer from the observer map', () => {
      const observer: TypeObserver = new TypeObserver();
      ObserverManager['observerMap'].set('testObserver', observer);
      ObserverManager.removeObserver('testObserver');
      expect(ObserverManager['observerMap'].size).toBe(0);
      expect(ObserverManager['observerMap'].get('testObserver')).toBeUndefined();
    });

    it('should log a message to the console', () => {
      const observer: TypeObserver = new TypeObserver();
      ObserverManager['observerMap'].set('testObserver', observer);
      ObserverManager.removeObserver('testObserver');
      expect(TypeLogger.log).toHaveBeenCalledWith('Removed observer: testObserver');
    });
  });
  
  describe('observerMap', () => {
    it('should be a Map', () => {
      expect(ObserverManager['observerMap']).toBeInstanceOf(Map);
    });
  });
});