
import * as SeroUtil from './sero_utilities'

export class GraphManager {
	GRAPH_TRANSFORM = {
		x: 0, y: 0, scale: 1
	}
	BANK_TRANSFORM = {
  	x: 0, y: 0, scale: 1
	}
	nodes: []
	links: []

	constructor() {

	}

	/*
		addNode
		removeNode
		addLink
		removeLink
		loadGraph
		getGraph
	*/

}

function transformPointFromAToB(px, py, TA, TB) {
  //convert point {px, py} from TA -> TB
  console.log(px, py, TA, TB)

  let tx = (px - TA.x) / TA.scale;
  let ty = (py - TA.y) / TA.scale;

  let rx = tx * (1/TB.scale) - TB.x;
  let ry = ty * (1/TB.scale) - TB.y;

  console.log("tx", tx, ty)

  return {x: rx, y: ry}
}