const container = document.getElementById('container');
const two = new Two({
  width: '600px',
  height: '600px',
  fullscreen: false
}).appendTo(container);
const svg = container.querySelector('svg');


class Path {

  constructor(start, container) {
    this.coords = [start];
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.element.setAttribute('stroke', '#000');
    this.element.setAttribute('fill', 'none');
    container.appendChild(this.element);
  }

  getPathAttr() {
    return `M${this.coords[0].x} ${this.coords[0].y} ${this.coords.slice(1).map(coords => `L ${coords.x} ${coords.y}`).join(' ')}`;
  }

  add(coords) {
    this.coords.push(coords);
    this.element.setAttribute('d', this.getPathAttr());
  }

}


function draw() {
  let isDrawing = false;
  let currentPath = null;
  
  let numberCircle = 1;
  
  let coordXmin;
  let coordXmax;
  let coordYmin;
  let coordYmax;
  let coordX;
  let coordY;
  let radiusX;
  let radiusY;
  let radius;
  
  let arrayCoords = {
    x: [],
    y: [],
  }
  
  const colors = ['#FF6347', '#FFA500', '#FFFF00', '#7FFF00', '#00FFFF', '#0000CD', '#FF00FF', '#DC143C', '#F08080', '#FFDAB9']
  
  const styles = {
    size: 18,
  }
  
  function getPoint(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    }
  }

  function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  function storeCoordinate(x, y, array) {
    array.x.push(x);
    array.y.push(y);
  }

  function minMaxCoords(array) {
    let coordXmin = Math.min.apply(null, array.x);
    let coordXmax = Math.max.apply(null, array.x);
    let coordYmin = Math.min.apply(null, array.y);
    let coordYmax = Math.max.apply(null, array.y);
    return [coordXmin, coordXmax, coordYmin, coordYmax];
  }
  
  function eventMouseDown(e) {
    arrayCoords.x.length = 0;
    arrayCoords.y.length = 0;
    coordXmin = null;
    coordXmax = null;
    coordYmin = null;
    coordYmax = null;
    coordX = null;
    coordY = null;
    radiusX = null;
    radiusY = null;
    radius = null;
    
    container.addEventListener('mousemove', eventMouseMove);
    container.addEventListener('mouseup', eventMouseUp);
    
    currentPath = new Path(getPoint(e), svg);
    isDrawing = true;
  }

  function eventMouseMove(e) {
    storeCoordinate(getPoint(e).x, getPoint(e).y, arrayCoords);

    coordXmin = minMaxCoords(arrayCoords)[0];
    coordXmax = minMaxCoords(arrayCoords)[1];
    coordYmin = minMaxCoords(arrayCoords)[2];
    coordYmax = minMaxCoords(arrayCoords)[3];

    radiusX = (coordXmax - coordXmin) / 2;
    radiusY = (coordYmax - coordYmin) / 2;
    radius = radiusX > radiusY ? radiusX : radiusY;

    coordX = coordXmin + radiusX;
    coordY = coordYmin + radiusY;

    if (isDrawing) {
      currentPath.add(getPoint(e));
    }
  }

  function eventMouseUp() {
    container.removeEventListener('mousemove', eventMouseMove);

    if (arrayCoords.x.length !== 0 && arrayCoords.y.length !== 0) {
      let circle = two.makeCircle(coordX, coordY, radius);
      circle.fill = getRandomColor();
      two.makeText(`Круг ${numberCircle++}`, coordX, coordY, styles);
      two.update();
    }
    let path = container.querySelector('svg > path');
    path.remove();
  }
  
  container.addEventListener('mousedown', eventMouseDown);
}


draw();