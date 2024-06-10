// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
	var ab = a.getBounds();
	var bb = b.getBounds();
	return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}