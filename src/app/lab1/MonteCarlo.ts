

export const compute = (x0, x1, y1, count, check: (a, b) => boolean): MonteCarlo => {
  console.log(`from=${x0} to=${x1} count=${count}`);
  const points: Point[] = [];
  let matches = 0;
  Array.from(Array(count).keys()).forEach(_ => {
    const x = getRandomArbitrary(x0, x1);
    const y = getRandomArbitrary(0, y1);
    const isInside = check(x, y);
    if (isInside){
      matches++;
    }
    points.push(new Point(x, y, isInside));
  });
  const square = Math.abs(x1 - x0) * y1;

  return new MonteCarlo(count, matches, square, points);
};

export class Point{
  x: number;
  y: number;
  isInside: boolean;

  constructor(x: number, y: number, isInside: boolean) {
    this.x = x;
    this.y = y;
    this.isInside = isInside;
  }
}

function getRandomArbitrary(min, max) {
  return (Math.random() * (max - min)) + min;
}

export class MonteCarlo{

  constructor(total: number, matches: number, square: number, points: Point[]) {
    this.total = total;
    this.matches = matches;
    this.square = square;
    this.ratio = this.matches / this.total;
    this.result = this.ratio * this.square;
    this.points = points;
  }

  public static compute = compute;
  result: number;
  ratio: number;
  square: number;
  points: Point[];
  total: number;
  matches: number;
}
