import { JsonIteratorPipe } from './json-iterator.pipe';

describe('JsonIteratorPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonIteratorPipe();
    expect(pipe).toBeTruthy();
  });
});
