
// Checks if the bounding box of an object contains the mouse
function containsMouse(a){
	var ab = a.getBounds();
	let mousePosition = app.renderer.plugins.interaction.mouse.global;
	return ab.x < mousePosition.x && ab.x + ab.width > mousePosition.x && ab.y < mousePosition.y && ab.y + ab.height > mousePosition.y;
}