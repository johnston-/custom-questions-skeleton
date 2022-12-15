/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */
//import * as DragFN from 'assessment_drag_fns';
import * as SeroUtil from './sero_utilities'

export class AssessmentManager {
  canvasElement = undefined;
  currentlyDragging = undefined;
  currentlyInteractingWith = undefined;
  mousedownNode = undefined;

  constructor() {

  }

  setCanvas(svgElement) {
    this.canvasElement = svgElement;
    console.log(this.canvasElement)
  }

  loadAssessment(assessmentObject) {
    
  }

  loadSKEAssessment(ao) {
    this.assessmentObject = ao;

    let bankGroup = '<g></g>';

    let nodeGroup = '<g>'+ ao.nodes.map(node => {
      let classes = `node ${node.type}`
      let nodeTranslate = `translate(${node.x},${node.y})`
      let nodeRect = getNodeRect(node)
      let nodeHandle = ``
      let nodeText = getNodeText(node)

      return `<g data-sero-id="${node.id}" class="${classes}" transform="${nodeTranslate}">${nodeRect}${nodeHandle}${nodeText}</g>`
    }).join("")+"</g>"

    let linkGroup = '<g>'+ao.links.map(link => {
      let coorString = getLinkCoors(link, ao.nodes)
      let classes = "link"
      let linePath = `<path class="line" d="${coorString}">`
      let areaPath = `<path class="line action_area" style="opacity:0;stroke-width:1em;" pointer-events="all" d="${coorString}">`
      let arrowheadGroup = '';

      if(link.type === "target"){
        let arrowheadTranslate = ``
        let arrowheadRotate = ``
        let arrowheadPathCoors = ``
        arrowheadGroup = `<g class="arrowhead" fill="#778899" transform="${arrowheadTranslate}"><path d="${arrowheadPathCoors}" transform="${arrowheadRotate}"></path></g>`
      }    

      return `<g data-sero-id="${link.id}" class="${classes}">${linePath}${areaPath}${arrowheadGroup}</g>`
    }).join("")+"</g>"

    let assessmentGroupTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`

    //return fully expanded svg object
    return `<g class="assessment" transform="${assessmentGroupTransform}">${linkGroup}${nodeGroup}</g>`
  }

  // INTERACTION FNs

    canvasMouseDown() {
      this.currentlyInteractingWith = this.currentlyInteractingWith || "canvas"
    }

    canvasMouseMove(event) {      
      if(this.currentlyInteractingWith === "canvas") {
        GRAPH_TRANSFORM.x += event.movementX;
        GRAPH_TRANSFORM.y += event.movementY;

        let assessmentEle = this.canvasElement.querySelector(".assessment")
        assessmentEle.setAttribute("transform", `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`)
      }
    }

    canvasMouseUp() {
      console.log("Canvas mouseup")
      this.currentlyInteractingWith = null;
    }

    nodeMouseDown(event) {
      let nodeId = event.target.parentElement.getAttribute('data-sero-id')
      this.mousedownNode = nodeId
      console.log("AM mousedown", nodeId)
      this.currentlyInteractingWith = this.currentlyInteractingWith || "node"
    }

    nodeMouseUp(event) {
      let nodeId = event.target.parentElement.getAttribute('data-sero-id')
      console.log("AM mouseup", nodeId)
      if(this.currentlyInteractingWith === "node"){
        if(this.mousedownNode === nodeId){
          let current = this.canvasElement.querySelector(`g[data-sero-id="${nodeId}"]`)
          console.log("select ", nodeId, current)
          current.childNodes[0].setAttribute("transform", "scale(1.2)")
        }
        else if(this.mousedownNode) {

        }
      }
      
    }

}

//---------


let GRAPH_TRANSFORM = {
    x: 100,
    y: 100,
    scale: 1
  }


// RENDER FNs
  function getNodeRect(node) {
    let formatted = '<rect ';
    formatted += `visibility="${node.style === 'none' ? 'hidden' : 'visible'}" `
    formatted += `width="${node.width + 4}" `
    formatted += `height="${node.height + 4}" `
    formatted += `x="${-node.width/2 - 2}" `
    formatted += `y="${-node.height/2 -1}" `
    formatted += '></rect>'

    return formatted
  }

  function getNodeText(node) {
    // node.formattedText = [{yPosition: number, chunks: [string], width: number}]
    let formatted = `<text class="" `
    formatted += `visibility="${node.style === 'none' ? 'hidden' : 'visible'}" `
    formatted += `y="${getNodeTextYPosition(node)}"`
    formatted += '>'
    formatted += getNodeTextTspans(node)
    formatted += '</text>'

    return formatted
  }

  function getNodeTextYPosition(d) {
    if(d.formattedText.length > 5){
      return -d.height*0.4
    }
    else if(d.formattedText.length >= 3){
      return -d.height*0.3
    }
    else if(d.formattedText.length == 2){
      return -d.height*0.2
    }

    return 2
  }

  function getNodeTextTspans(d) {
    return d.formattedText.map(ft => {
      let formattedChunkText = ft.chunks.join(" ");
      return `<tspan x="0" dy="${ft.yPosition}" text-anchor="middle">${formattedChunkText}</tspan>`
    }).join("")
  }

  function getLinkCoors(d, nodes) {
    let source = nodes.find(n => n.id === d.source)
    let target = nodes.find(n => n.id === d.target)
    let compass = {
      x: target.x,
      y: target.y
    }
    return `M${source.x},${source.y}L${compass.x},${compass.y}`
  }

  function getArrowheadCoors(d, nodes) {
    return 
  }

// STYLE FNs
  function styleFillInItem(item, node) {
    node.style = "fillIn"
    node.assessmentItem = 'fill-in'
    node.assessmentId = item.id
    node.showHint = item.config.showHint;
    let hintChars = item.config.correctAnswer.split(" ").map(x => x.split("").map(() => "-").join("")).join(" ")
    node.displayValue = item.config.userAnswer ? item.config.userAnswer : hintChars;
  }