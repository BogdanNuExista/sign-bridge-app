// Mock prediction service. Later replace with tfjs inference.

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export async function mockPredict(_imageUri: string): Promise<string> {
  // Simulate network / compute delay
  await new Promise(r => setTimeout(r, 800));
  // 50% chance correct for demo
  if (Math.random() < 0.5) {
    return _imageUri.length % 26 >=0 ? LETTERS[_imageUri.length % 26] : 'A';
  }
  return LETTERS[Math.floor(Math.random()*26)];
}
