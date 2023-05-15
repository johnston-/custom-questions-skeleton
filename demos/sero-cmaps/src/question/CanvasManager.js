/*
	CanvasManager deals with rendering the graph content initially and on update.
	This separates the specifics from GraphManager and AssessmentManager.
	CanvasManager can use different implementations for different environments, SVG DOM, bitmap, etc...
	renderType can be {SVG, Pixi}
*/

import * as SeroUtil from './sero_utilities'

export class CanvasManager {
	// Variables
		canvasElement = undefined;
		toolbarelement = undefined;
		footerElement = undefined;
		width = undefined;
		height = undefined;
		displayFooter = undefined;
	
	constructor(canvasContainerElement, renderType){
		//use canvascontainerElement to attach the rendered DOM
	}

	/*
		canvasEvents
			canvasMouseDown
			canvasMouseMove
			canvasMouseUp

			nodeMouseOver
			nodeMouseDown
			nodeMouseUp
			nodeMouseOut

			linkMouseOver
			linkMouseDown
			linkMouseUp
			linkMouseOut


		clearTempGroup

		setDimensions

		renderAssessment

		redrawGraphContent

		removeGraphContent

		selectNodes

		selectLink

		moveNode

		render FNs

		graphTransform

		bankTransform

		transformAToB

		footer FNs

		getElementByOid

		getNodesByLink

		setEvents

		pointerEvents

		addNode

		removeNode

		addLink

		removeLink

		checkTextWidth

		highlightClosestNode

		clearScaleSizing

		

	*/
}