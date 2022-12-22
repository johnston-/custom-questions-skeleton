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
  footerElement = undefined;
  displayFooter = undefined;
  currentlyDragging = undefined;
  currentlyInteractingWith = undefined;
  mousedownNode = undefined;
  selectedNodes = []

  constructor() {
    this.displayFooter = false
  }

  setCanvasElement(svgElement) {
    this.canvasElement = svgElement;
  }

  setFooterElement(footerElement) {
    this.footerElement = footerElement;
    console.log(this.footerElement)
    this.footerElement.appendChild(getFooterContent())
  }

  renderAssessment(assessmentObject) {
    
  }

  renderSKEAssessment(ao) {
    
    styleSKEAssessment(ao)

    this.assessmentObject = ao;
    return renderAssessment(ao).outerHTML
  }

  // FOOTER
    toggleFooter(force) {
      let show = force !== undefined ? force : !this.displayFooter;
      this.displayFooter = show;
      this.footerElement.setAttribute("class", this.displayFooter ? "wrapper" : "wrapper collapseFooter");
    }

    renderChoicesFooter(choices, node) {

    }

  
  // STYLE FNs
    selectNodes(nodes) {
      if(this.selectedNodes.length > 0){
        //clear
        this.selectedNodes.forEach(nid => {
          let current = this.getElementByObjId(nid)
          current.childNodes[0].removeAttribute("transform")
        })
      }

      this.selectedNodes = nodes;
      this.selectedNodes.forEach(nid => {
        let current = this.getElementByObjId(nid)
        console.log(current)
        current.children[0].setAttribute("transform", "scale(1.2)")
        //console.log("select ", nodeId, current)
      })
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
      else if(this.currentlyDragging){
        this.moveNode(this.currentlyDragging, event.movementX, event.movementY)
        //let node = this.assessmentObject.nodes.find(n => n.id === this.currentlyDragging)
        //node.x += event.movementX;
        //node.y += event.movementY;
        //let current = this.getElementByObjId(this.currentlyDragging)
        //current.setAttribute("transform", `translate(${node.x}, ${node.y})`)
      }
    }

    canvasMouseUp() {
      console.log("Canvas mouseup")
      if(this.currentlyInteractingWith === "canvas" && this.selectedNodes.length > 0){
        this.selectNodes([])
      }
      this.currentlyInteractingWith = null;
      this.currentlyDragging = null;
      this.mousedownNode = null;
    }

    nodeMouseDown(event) {
      let nodeId = event.target.parentElement.getAttribute('data-sero-id')
      let current = this.assessmentObject.nodes.find(n => n.id === nodeId)
      this.mousedownNode = nodeId
      console.log("AM mousedown", nodeId)

      this.currentlyInteractingWith = this.currentlyInteractingWith || "node"

      if(current.assessmentItem === "connect-to"){
        this.currentlyDragging = nodeId;
      }
    }

    nodeMouseUp(event) {
      let nodeId = event.target.parentElement.getAttribute('data-sero-id')
      let current = this.assessmentObject.nodes.find(n => n.id === nodeId)
      console.log("AM mouseup", nodeId)
      if(this.currentlyInteractingWith === "node"){
        if(current.assessmentItem && this.mousedownNode === nodeId){          
          this.triageSKEItemMouseUp(current)
        }
        else if(this.mousedownNode === nodeId){          
          this.selectNodes([nodeId])               
        }
        else if(this.mousedownNode) {

        }
      }
      
    }

    linkMouseOver() {
      //if arrowhead -> style
    }

    linkMouseDown(event) {
      // clear selectNodes
      // select link
      this.selectNodes([])
      let linkId = event.target.parentElement.getAttribute('data-sero-id')
      console.log("link mousedown", linkId)
      this.currentlyInteractingWith = this.currentlyInteractingWith || "link"
    }

    linkMouseUp() {
      //if connect-link -> display delete icon
      //if arrowhead -> select link      
    }

    linkMouseOut() {
      //if arrowhead -> unstyle
    }

    // UI UTIL
      clickErrorCorrect(node){
        let item = this.assessmentObject.items.find(x => x.id == node.assessmentId)
        let randomChoices = shuffle(item.config.choices.concat(item.config.correctAnswer))
        this.renderChoicesFooter(randomChoices, node);
      }

      triageSKEItemMouseUp(node) {
        //
        if(node.assessmentItem === "fill-in") {
          console.log("triage fill in !")
          this.loadItemNode(node)
        }
        else if(node.assessmentItem === "multi-choice") {
          console.log("triage mc !")
          this.loadItemNode(node)
          
          
        }
        else if(node.assessmentItem === "error-detection") {
          console.log("triage error correct !")
        }
      }

  // ITEMS
    loadItemNode(node) {
      let item = this.assessmentObject.items.find(x => x.id === node.assessmentId)
      console.log(node, item)
      if(item) {
        if(this.currentItem === item) {
          this.currentItem = null;
          this.toggleFooter();
          return
        }
        this.currentItem = item;

        if(item.type === "multiChoice") {
          let shuffled = SeroUtil.shuffle(item.config.choices.concat(item.config.correctAnswer));

          loadChoicesFooter(this.footerElement, node, shuffled, "multiChoice", this);
          this.toggleFooter(true)
        }

        else if(item.type === "fillIn"){
          let formatted = item.config.userAnswer || item.config.correctAnswer.split("").map(() => "_").join("")
          loadFillInFooter(this, node, item, formatted)
          this.toggleFooter(true)
        }
      }
    }

  // UTIL
    getElementByObjId(oid) {
      return this.canvasElement.querySelector(`g[data-sero-id="${oid}"]`)
    }

    moveNode(nodeId, mx, my) {
      //get all content to redraw while moving
      // move the node
      // move all connected links
      // rotate arrowhead on all connected target links
      //console.log(nodeId, mx, my)
      let nodesToRedraw = this.assessmentObject.nodes.filter(n => n.id === nodeId);
      let linksToRedraw = this.assessmentObject.links.filter(e => e.source === nodeId || e.target === nodeId);

      nodesToRedraw.forEach(n => {
        n.x += mx;
        n.y += my;
        let c = this.getElementByObjId(n.id);
        if(n.assessmentItem === "connect-to"){
          //rotate arrowhead
          let arrowhead = c.querySelector(".connectToArrowhead")
          let source = this.assessmentObject.nodes.find(z => z.id == n.parentNode)
          let ahRotate = SeroUtil.formatRotation(source, n)
          arrowhead.setAttribute("transform", `rotate(${ahRotate})`)
        }
        c.setAttribute("transform", `translate(${n.x}, ${n.y})`)
      })

      linksToRedraw.forEach(e => {
        let c = this.getElementByObjId(e.id);
        // update line coors
        c.querySelectorAll(".line").forEach(link => {
          let coorNodes = getNodesByLink(e, this.assessmentObject.nodes)
          link.setAttribute("d", getLinkCoors(coorNodes.source, coorNodes.target))          
        })

        //update arrowhead transform

      })
    }

    checkTextWidth(textToMeasure) {
      let checkText = this.canvasElement.querySelector("g[data-sero-checktext] > text")
      checkText.innerHTML = textToMeasure;
      return checkText.getComputedTextLength()
    }

    updateNodeDisplayValue(d, newValue){
      let checkTextG = this.canvasElement.querySelector("g[data-sero-checktext]") 
      let checkText = checkTextG.querySelector("text")
      delete d.icon
      d.displayValue = newValue
      d.formattedText = SeroUtil.chunkNodeText(d, checkText)
      let ele = this.getElementByObjId(d.id)
      let eleText = ele.querySelector("text")
      //console.log("ele", ele)

      if(d.assessmentItem && d.assessmentItem === "multi-choice"){
        delete d.icon
        let img = ele.querySelector("image")
        if(img) {
          img.remove();
          ele.querySelector('rect').remove();
        }
        if(!eleText) {
          eleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          eleText.setAttribute("visibility", "visible")
          eleText.setAttribute("y", 0)
          ele.appendChild(eleText)
        }
      }

      checkText.innerHTML = "";
      d.formattedText.forEach((x,i) => {
        let chunkText = x.chunks.join(" ")
        if(chunkText.trim().length > 0){
          let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.setAttribute("dy", i == 0 ? 4 : 14)
          tspan.setAttribute("x", 0)
          tspan.innerHTML = chunkText
          checkText.appendChild(tspan)
        }
      })
      //let resultBB = ele.getBBox()
      let resultBB = checkTextG.getBoundingClientRect()
      console.log("bbox", resultBB)
      
      let pad = d.type == 'relation' ? [4, 2] : [4, 2]
      d.height = resultBB.height + pad[1]
      d.width = resultBB.width + pad[0]

      //redraw node
      //ele.outerHTML = renderNode(d).outerHTML
      let nodeTranslate = `translate(${d.x},${d.y})`
      ele.setAttribute("transform", nodeTranslate)
      ele.innerHTML = renderNode(d).innerHTML
    }
}

//---------


let GRAPH_TRANSFORM = {
    x: 100,
    y: 100,
    scale: 1
  }

let takerInstructionMap = {
  multiChoice:
    {
      'itemType': 'multi-choice',
      'title': 'Multiple choice',
      'instruction': 'Select the correct answer. '
     },
  fillIn:
    {
      'itemType': 'fill-in',
      'title': 'Fill-in',
      'instruction': 'Type the answer into the blank space. ',
      'detail': 'Uppercase, lowercase, singular, and plural are all acceptable.'
    },
  errorCorrect:
    {
      'itemType': 'error-correct',
      'title': 'Error correct',
      'instruction': 'This part of the map may be incorrect. If so, select an option to correct it.'
    },
  errorDetection:
    {
      'itemType': 'error-correct',
      'title': 'Error correct',
      'instruction': 'This part of the map may be incorrect. If so, select an option to correct it.'
    },
  dragDrop: {
      'title': 'Drag-and-drop',
      'instruction': 'Click-and-drag the concept or linking phrase to the spot where it connects to the map. To delete a connection, select the link and click the “x” icon.',
      'detail': 'Some items in the word bank may not belong in the map.'
    },
  connectTo: {
      'title': 'Connect to',
      'instruction': 'Click-and-drag an arrow to the spot where it connects. To delete a connection, select the link and click the “x” icon.',
      'detail': 'Make sure to connect all of the arrows if more than one.'
    },
  arrowheadDirection: {
      'title': 'Arrowhead direction',
      'instruction': 'Select the side of the linking phrase where the arrowhead belongs.',
      'detail': 'Make sure the “concept > linking phrase > concept” statement points in the right direction.'
    }
  }

// RENDER FNs
  
  function renderAssessment(ao) {
    // style
      console.log(ao)

    // render 
      let assessmentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      let bankGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      let nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      let linkGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

      ao.nodes.forEach(node => {
        let nodeEle = renderNode(node, ao.nodes)
        nodeGroup.appendChild(nodeEle)
      })

      ao.links.forEach(link => {
        let linkNodes = getNodesByLink(link, ao.nodes)
        let coorString = getLinkCoors(linkNodes.source, linkNodes.target)
        let linkTypes = ["link", link.type]
        if(link.style){
          linkTypes.push(link.style)
        }
        let classes = linkTypes.join(" ")
        let linePath = `<path class="line" d="${coorString}"></path>`
        let areaPath = `<path class="line action_area" style="opacity:0;stroke-width:1em;" pointer-events="all" d="${coorString}"></path>`
        let arrowheadGroup = '';

        if(link.type === "target"){
          let arrowheadTranslate = ``
          let arrowheadRotate = ``
          let arrowheadPathCoors = ``
          arrowheadGroup = `<g class="arrowhead" fill="#778899" transform="${arrowheadTranslate}"><path d="${arrowheadPathCoors}" transform="${arrowheadRotate}"></path></g>`
        }

        let linkEle
        linkGroup.innerHTML += `<g data-sero-id="${link.id}" class="${classes}">${linePath}${areaPath}${arrowheadGroup}</g>`

      })

      ao.bank.forEach(node => {
        console.log("bank node", node)
        let nodeEle = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let classes = "bank node"
        let nodeTranslate = `translate(${node.x},${node.y})`
        nodeEle.setAttribute("data-sero-id", node.id)
        nodeEle.setAttribute("class", classes)
        nodeEle.setAttribute("transform", nodeTranslate)
        nodeEle.appendChild(getNodeRect(node))
        nodeEle.appendChild(getNodeText(node))
        bankGroup.appendChild(nodeEle)
      })

    let assessmentGroupTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`

    assessmentGroup.setAttribute("class", "assessment")
    assessmentGroup.setAttribute("transform", assessmentGroupTransform)
    assessmentGroup.appendChild(linkGroup)
    assessmentGroup.appendChild(bankGroup)
    assessmentGroup.appendChild(nodeGroup)
    //this.canvasElement.innerHTML = '';
    return assessmentGroup
  }

  function renderNode(node, nodes){
    let nodeEle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    //console.log(node)
    let nodeTypes = ["node", node.type]
    if(node.assessmentItem){
      let itemTypeMap = {
        "fill-in": "fillIn",
        "multi-choice": "multiChoice",
        "drag-drop": "dragDrop"
      }
      //nodeTypes.push(itemTypeMap[node.assessmentItem])
      nodeTypes.push(node.style)
    }
    let classes = nodeTypes.join(" ")

    let nodeTranslate = `translate(${node.x},${node.y})`
    nodeEle.setAttribute("data-sero-id", node.id)
    nodeEle.setAttribute("class", classes)
    nodeEle.setAttribute("transform", nodeTranslate)
      
    if(node.assessmentItem === "multi-choice" && node.icon) {
      let icon = getMCIcon(node)
      nodeEle.appendChild(getNodeRect(node))
      nodeEle.appendChild(icon)
    }
    else if(node.assessmentItem === "connect-to") {
      nodeEle.innerHTML = getConnectToArrowhead(node, nodes)
    }
    else {
      nodeEle.appendChild(getNodeRect(node))
      nodeEle.appendChild(getNodeText(node))
    }

    return nodeEle
  }

  function renderLink(link) {

  }

  function getNodeRect(node) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("visibility", node.style === 'none' ? 'hidden' : 'visible')
    rect.setAttribute("width", node.width + 4)
    rect.setAttribute("height", node.height + 4)
    rect.setAttribute("x", -node.width/2 - 2)
    rect.setAttribute("y", -node.height/2 - 2)
    return rect
  }

  function getNodeText(node) {
    // node.formattedText = [{yPosition: number, chunks: [string], width: number}]
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("visibility", node.style === 'none' ? 'hidden' : 'visible')
    if(node.formattedText){
      text.setAttribute("y", getNodeTextYPosition(node))

      getNodeTextTspans(node).forEach(x => {
        text.appendChild(x)
      })
    }
    else if(node.displayValue) {
      text.setAttribute("y", 0)
      text.innerHTML = node.displayValue
    }
    else if(node.value) {
      text.setAttribute("y", 0)
      text.innerHTML = node.value
    }

    return text
  }

  function getNodeTextYPosition(d) {
    if(d.formattedText.length > 5){
      return -d.height*0.4
    }
    else if(d.formattedText.length == 5){
      return -30
    }
    else if(d.formattedText.length == 4){
      return -30
    }
    else if(d.formattedText.length == 3){
      return -20
    }
    else if(d.formattedText.length == 2){
      //return -d.height*0.2
      return -10
    }

    return 0
  }

  function getNodeTextTspans(d) {
    return d.formattedText.map(ft => {
      let formattedChunkText = ft.chunks.join(" ");
      let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", 0)
      tspan.setAttribute("dy", ft.yPosition)
      tspan.setAttribute("text-anchor", "middle")
      tspan.textContent = formattedChunkText
      return tspan
    })
  }

  function getNodesByLink(link, nodes) {
    return {
      source: nodes.find(n => n.id === link.source),
      target: nodes.find(n => n.id === link.target)
    }
  }

  function getLinkCoors(sourceNode, targetNode) {
    
    let compass = {
      x: targetNode.x,
      y: targetNode.y
    }

    return `M${sourceNode.x},${sourceNode.y}L${compass.x},${compass.y}`
  }

  function getArrowheadCoors(d, nodes) {
    return 
  }

// FOOTER FNs

  function getFooterContent() {
    let result = document.createElement('div')
    result.setAttribute("class", "footerContent")

    let title = document.createElement("p")
    title.setAttribute("class", "title")

    let instr = document.createElement("div")
    instr.setAttribute("class", "instruction")
    
    let cont = document.createElement("div")
    cont.setAttribute("class", "container")
    
    result.appendChild(title)
    result.appendChild(instr)
    result.appendChild(cont)
    return result
  }

  function loadStaticFooter(ele, type) {

  }

  function loadFillInFooter(that, node, item, displayText) {
    let ele = that.footerElement
    let type = "fillIn"
    let titleE = ele.querySelector(".title")
    titleE.innerHTML = takerInstructionMap[type].title
    
    let instructionE = ele.querySelector(".instruction")
    instructionE.innerHTML = "";

    let instructText = document.createElement("p")
    instructText.setAttribute("class", "textDouble")
    instructText.innerHTML = takerInstructionMap[type].instruction
    instructionE.appendChild(instructText)

    if(takerInstructionMap[type].detail){
      let detailText = document.createElement("p")
      detailText.setAttribute("class", "detail")
      detailText.innerHTML = takerInstructionMap[type].detail
      instructionE.appendChild(detailText)
    }

    let containerE = ele.querySelector(".container")
    containerE.innerHTML = "";

    let textarea = document.createElement("textarea")
    textarea.setAttribute("name", "")
    textarea.setAttribute("rows", 10)
    textarea.setAttribute("cols", 30)
    textarea.addEventListener("blur", () => { 
      console.log("blurred fill in")
      that.toggleFooter()
  })
    textarea.addEventListener("keypress", (e) => {
      if(e.key === "Enter") {
        e.preventDefault();
        that.updateNodeDisplayValue(node, "test")
        that.toggleFooter()
      }
    })

    let lDivide = document.createElement("div")
    lDivide.setAttribute("class", "leftDivider")
    lDivide.appendChild(textarea)
    containerE.appendChild(lDivide)
  }

  function loadChoicesFooter(ele, node, choiceStrings, type, that) {

    let titleE = ele.querySelector(".title")
    titleE.innerHTML = takerInstructionMap[type].title

    let instructionE = ele.querySelector(".instruction")
    instructionE.innerHTML = "";

    let containerE = ele.querySelector(".container")
    containerE.innerHTML = "";
    
    let instructText = document.createElement("p")
    instructText.setAttribute("class", type === "multiChoice" ? "textSingle" : "textDouble")
    instructText.innerHTML = takerInstructionMap[type].instruction
    instructionE.appendChild(instructText)

    if(takerInstructionMap[type].detail){
      let detailText = document.createElement("p")
      detailText.setAttribute("class", "detail")
      detailText.innerHTML = takerInstructionMap[type].detail
      instructionE.appendChild(detailText)
    }

    let divider = document.createElement("span")
    divider.setAttribute("class", "pillsDivider")
    containerE.appendChild(divider)

    let pills = document.createElement("div")
    pills.setAttribute("class", "pills-wrapper")
    containerE.appendChild(pills)

    let formattedChoices = choiceStrings.forEach(choice => {
      let r = document.createElement("label")
      r.setAttribute("data-sero-choice", choice)
      r.innerHTML = choice
      r.addEventListener("click", () => { 
        that.updateNodeDisplayValue(node, choice)
        that.toggleFooter()
      })
      pills.appendChild(r)
    })

  }


// STYLE FNs
  function styleSKEAssessment(ao){
    styleFillInItems(ao.nodes, ao.items);
    styleMultiChoiceItems(ao.nodes, ao.items);
    styleErrorCorrectItems(ao.nodes, ao.items)
    styleConnectToItems(ao.nodes, ao.links, ao.items);
    styleDragDropItems(ao.nodes, ao.links, ao.bank, ao.items);
    styleArrowDirectionItems(ao.nodes, ao.links, ao.items);
    ao.links = ao.links.filter(e => e.style !== "hidden")
    ao.nodes = ao.nodes.filter(n => n.style !== "hidden")
  }

  // Fill-In
    function styleFillInItems(nodes, items) {
      let fillIns = items.filter(item => item.type == 'fillIn')

      fillIns.forEach(fillIn => {
        let fillStyles = Object.keys(fillIn.styles)
        nodes.filter(n => fillStyles.includes(n.id)).forEach(x => {
          styleFillInItem(fillIn, x)
        })
      })
      
      return nodes
    }

    function styleFillInItem(item, node) {
      node.style = "fillIn"
      node.assessmentItem = 'fill-in'
      node.assessmentId = item.id
      node.showHint = item.config.showHint;
      let hintChars = item.config.correctAnswer.split(" ").map(x => x.split("").map(() => "-").join("")).join(" ")
      node.displayValue = item.config.userAnswer ? item.config.userAnswer : hintChars;
    }

    function updateFillIn(item, node, newValue) {
      //
      newValue = newValue && newValue.length > 0 ? newValue : null
      item.config.userAnswer = newValue;
    }

  // MC
    function styleMultiChoiceItems(nodes, items) {
      let multiChoices = items.filter(item => item.type == 'multiChoice')

      multiChoices.forEach(mc => {
        Object.entries(mc.styles).forEach(([id, style]) => {
          let target = nodes.find(x => x.id == id);
          styleMCItem(mc, target)
        })
      })

      return nodes
    }

    function styleMCItem(item, node) {
      if(item.config.userAnswer){
        node.displayValue = item.config.userAnswer;
        delete node.icon;
      }
      else {
        node.icon = "assets/icons/mcIcon.svg" 
      }
      
      node.style = 'multiChoice'
      node.assessmentItem = 'multi-choice'
      node.assessmentId = item.id
    }

    function getMCIcon(d) {
      d.height = 32
      d.width = 32;

      let result = document.createElementNS("http://www.w3.org/2000/svg", "image")
      result.setAttribute("height", d.height)
      result.setAttribute("width", d.width)
      result.setAttribute("x", -d.width/2)
      result.setAttribute("y", -d.height/2)
      result.setAttribute("xlink:href", d.icon)
      result.setAttribute("pointer-events", "none")
      return result
    }

  // Error Correct
    function styleErrorCorrectItems(nodes, items) {
      let errorItems = items.filter(item => item.type == 'errorDetection')

      errorItems.forEach(errorItem => {
        Object.entries(errorItem.styles).forEach(([id, style]) => {
          let target = nodes.find(x => x.id == id);
          styleErrorCorrectItem(errorItem, target);
        })
      })

      return nodes
    }

    function styleErrorCorrectItem(item, node) {
      node.assessmentItem = 'error-detection'
      //node.assessmentItem = 'error-correct'
      node.assessmentId = item.id;
      let randChoice = SeroUtil.shuffle(item.config.choices)[0];
      node.displayValue = item.config.userAnswer ? item.config.userAnswer : item.config.choices ? randChoice : "error"
    }

    function clickErrorCorrect(node, items){
      let item = items.find(x => x.id == node.assessmentId)
      let randomChoices = shuffle(item.config.choices.concat(item.config.correctAnswer))
      //loadChoicesFooter(randomChoices, node);
    }
  // Arrow Direction

  // Connect-To
    function styleConnectToItems(nodes, links, items) {
      let connectItems = items.filter(item => item.type == 'connectTo')

      connectItems.forEach(conItem => {

        if(!conItem.config.userLinks || conItem.config.userLinks.length < conItem.config.correctLinks.length){
          let entries = Object.entries(conItem.styles)

          let hiddenStyles = entries.filter(z => z[1] == 'hidden').map(x => x[0])
          let conStyles = entries.filter(z => z[1] == 'connectTo').map(x => x[0])

          conStyles.forEach(x => {
            let n = nodes.find(z => z.id == x)
            nodes.push({
              id: x+"-->",
              value: "-->",
              type: n.type,
              x: n.x,
              y: n.y + n.height/2 + 20,
              width: 10,
              height: 10,
              assessmentId: conItem.id,
              assessmentItem: 'connect-to',
              parentNode: x
            })
            
            links.push({
              id: x+"-selector",
              source: x,
              target: x+"-->",
              type: "source",
              assessmentId: conItem.id,
              assessmentItem: 'selector-link'
            })

          })

          links.filter(x => hiddenStyles.includes(x.id)).forEach(x => { styleHiddenItem(x) })  
        }
        
      })
    }

    function getConnectToArrowhead(node, nodes) {
      let d = SeroUtil.getPentagonCoors(0, 0, 26)
      let source = nodes.find(z => z.id == node.parentNode)
      let ahRotate = SeroUtil.formatRotation(source, node)

      return `<path class="connectToArrowhead" d="${d}" transform="rotate(${ahRotate})" fill="#4db748"></path>`
    }

  // Drag Drop
      function styleDragDropItems(nodes, links, bank, items) {
        
        let dropItems = items.filter(item => item.type == 'dragDrop')

        dropItems.forEach(dropItem => {
          let dropTarget = nodes.find(x => x.id == dropItem.targetId);
          let entries = Object.entries(dropItem.styles);

          let hiddenStyles = entries.filter(z => z[1] == 'hidden').map(x => x[0])
          let dropStyles = entries.filter(z => z[1] == 'dragDrop').map(x => x[0])

          if(dropItem.config.choices){
            dropItem.config.choices
              .filter(x => !nodes.find(y => y.value === x))
              .forEach((x,i) => {
                let n = newDropItem({id: SeroUtil.getGraphId(), value: x, type: dropTarget.type}, dropItem.id, true);
                bank.push(n); 
              })
          }

          nodes.filter(x => 
            dropStyles.includes(x.id) &&
            //!x.style &&
            //!nodes.find(n => n.assessmentId && n.assessmentId == dropItem.id)
            !links.find(y => 
              y.assessmentId && y.assessmentId == dropItem.id && 
              !hiddenStyles.includes(y.id) && 
              typeof y.target == "string" ? y.target == x.id : y.target.id == x.id
            )
          )
          .forEach(x => {            
            let n = newDropItem(x, dropItem.id, false);
            bank.push(n);

            x.style = "hidden"       
          })

          links.filter(x => hiddenStyles.includes(x.id)).forEach(x => {
            x.style = "hidden";
          })

          console.log("styled drag items", dropItem, nodes, links, bank); 
        })
      }

      function styleDragDropItem(item, node) {
        node.style = 'dragDrop'
        node.assessmentItem = 'drag-drop'
        node.assessmentId = item.id
        delete node.fx
        delete node.fy
        delete node.set
      }

      function newDropItem(node, aid, dis) {
        return {
          id: node.id,
          value: node.value,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          formattedText: node.formattedText,
          style: aid == 'build-a-map' ? 'buildDrop' : 'dragDrop',
          assessmentItem: 'drag-drop',
          type: node.type,
          assessmentId: aid,
          distractor: dis == true ? true : false
        }
      }

  // Arrow Direction
    function styleArrowDirectionItems(nodes, links, items) {
      let directionItems = items.filter(item => item.type == 'arrowDirection')

      directionItems.forEach(directionItem => {
        let dirStyles = Object.keys(directionItem.styles).filter(z => directionItem.styles[z] == 'directionless')
        links.filter(x => dirStyles.includes(x.id)).forEach(x => { styleDirectionlessItem(x, directionItem) })

        let target = nodes.find(x => x.id === directionItem.targetId);
        target.style = "directionRelation";
        target.assessmentItem = "directionRelation";
        target.assessmentId = directionItem.id;

      })
    }

    function styleDirectionlessItem(link, item) {
      link.style = "ad_default"
      link.assessmentItem = 'arrow-direction'
      link.assessmentId = item.id

      if(link.type == 'source'){
        let t = link.source
        let s = link.target
        link.source = s
        link.target = t
        link.type = 'target'
      }
    }

    function updateArrowDirection(itemId, targetLinkId, links) {
      let item = this.assessmentObject.items.find(x => x.id == itemId)
      let link = links.find(x => x.id == targetLinkId)
      links.filter(x => x.assessmentId && x.assessmentId === itemId).forEach(x => {
        delete x.directionItem;
        x.style = "ad_unselect"
      })
      link.directionItem = true
      link.style = "ad_select";
      item.config.userLinks = [targetLinkId];
    }

  function styleHiddenItem(item) { item.style = "hidden" }