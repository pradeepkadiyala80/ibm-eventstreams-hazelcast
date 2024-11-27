import * as EventMappings from './EventMappings';

describe('EventMappings test', () => {
  test('should return no event handler', async () => {
    let handler = EventMappings.getEventHandler('translate');
    expect(handler).toBeUndefined();
  });
});
