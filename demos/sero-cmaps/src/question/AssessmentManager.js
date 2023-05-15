/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */

import * as SeroUtil from './sero_utilities'

export class AssessmentManager {
  // Variables
    canvasElement = undefined;
    toolbarElement = undefined;
    footerElement = undefined;
    graphType = undefined;
    width = undefined;
    height = undefined;
    learnosityEvents = undefined;
    displayFooter = undefined;
    currentlyDragging = undefined;
    currentlyInteractingWith = undefined;
    mousedownNode = undefined;
    mousedownLink = undefined;
    selectedNodes = []
    selectedLink = undefined;
    toDelete = {nodes: [], links: []};

  constructor() {
    this.displayFooter = false
    this.darkMode = false
  }

  // RENDER FNs
    setCanvasElement(svgElement) {
      //container
      //-toolbar containern
      //--link container
      //--bank container
      //--node container
      //--temp container

      this.canvasElement = svgElement;
      this.canvasElement.innerHTML = `<defs><marker id="end-arrow" viewBox="0 -5 10 10" refX="6" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto"><path d="M0,-5L10,0L0,5" fill="#778899"></path></marker></defs>
      <g data-sero-checktext visibility="hidden"><text font-family="Muli600"><tspan dy="4" x="0">some text</tspan></text></g>`;
    }

    setToolbarElement(toolElement) {
      let toolbarItems = ["zoomIn", "zoomOut", "zoomToFit"]

      this.toolbarElement = toolElement
      this.toolbarElement.innerHTML = '';

      // toolbar includes
      // - title
      // - toolbar icons
      //   - zoomIn
      //   - zoomOut
      //   - zoomToFit

      let titleContainer = document.createElement('div')
      titleContainer.setAttribute("class", "titleTaker")

      let iconContainer = document.createElement('div')
      iconContainer.setAttribute("class", "zoomIcons")

      toolbarItems.forEach(item => {
        let currentItem = document.createElement("img")
        let itemData = toolbarData[item]
        currentItem.title = itemData.title
        currentItem.alt = itemData.alt
        currentItem.src = itemData.src
        currentItem.addEventListener("click", () => {
          if(item === "zoomIn") this.zoomIn();
          if(item === "zoomOut") this.zoomOut();
          if(item === "zoomToFit") this.zoomToFit();
        })
        iconContainer.append(currentItem)
      })      

      this.toolbarElement.append(titleContainer, iconContainer)
    }

    setFooterElement(footerElement) {
      this.footerElement = footerElement;
      this.footerElement.setAttribute("class", this.darkMode ? "sero_footer_wrapper collapseFooter dark" : "sero_footer_wrapper collapseFooter")
      this.footerElement.appendChild(getFooterContent())

      let arrow = document.createElement("div")
      arrow.setAttribute("class", "sero_footer_footerArrow")
      arrow.innerHTML = `<img src="assets/icons/arrowLeft.svg" />`
      arrow.addEventListener("click", () => this.toggleFooter())
      this.footerElement.append(arrow)
    }

    setQuestionEvents(learnEvents) {
      this.learnosityEvents = learnEvents
    }

    renderAssessment(ao) {
      this.graphType = "assessment"
      if(ao.type === "skeleton-map") this.renderSKEAssessment(ao);
      else if(ao.type === "build-map") this.renderBAMAssessment(ao);
      setToolbarTitle(ao.name)
    }

    renderSavedAssessment(ao){
      this.graphType = "assessment"
      this.assessmentObject = ao;
      this.canvasElement.append(renderAssessment(ao, this))
      this.setGraphEvents()
    }

    renderSKEAssessment(ao) {
      SeroUtil.resetNodePositions(ao.nodes)

      styleSKEAssessment(ao)
      this.assessmentObject = ao;
      //resize graph to window
        let initSize = SeroUtil.getExtents(ao.nodes)
        let minX = ao.nodes.reduce((a,x) => { return Math.min(x.width ? x.x - x.width/2 : x.x, a) }, Infinity)
        let minY = ao.nodes.reduce((a,x) => { return Math.min(x.height ? x.y - x.height/2 : x.y, a) }, Infinity)
        let initRatio = [this.width / (initSize.width*1.4), this.height / (initSize.height*1.4)]
        //console.log("init size", initSize, initRatio)
        GRAPH_TRANSFORM.scale = initRatio[0] < initRatio[1] ? initRatio[0] : initRatio[1];
        if(GRAPH_TRANSFORM.scale > 1) GRAPH_TRANSFORM.scale = 1; //lol temporary
        GRAPH_TRANSFORM.x = minX+10;
        GRAPH_TRANSFORM.y = minY+10;

      this.canvasElement.setAttribute("style", this.darkMode ? "background: black" : "background: white")
      this.canvasElement.append(renderAssessment(ao, this))
      this.setGraphEvents()
    }

    renderBAMAssessment(ao) {
      ao.settings.rawTriples = ao.triples
      ao.triples = []
      styleBAMAssessment(ao, [this.width, this.height], this)
      this.assessmentObject = ao;
      this.canvasElement.setAttribute("style", this.darkMode ? "background: black" : "background: white")
      this.canvasElement.append(renderAssessment(ao, this))
      this.setGraphEvents()
    }

    renderReviewAssessment(ao) {
      this.graphType = "review"
      this.assessmentObject = ao;

      if(ao.type === "skeleton-map") this.renderSKEReviewAssessment(ao);
      if(ao.type === "build-map") this.renderBAMReviewAssessment(ao);
      setToolbarTitle(ao.name, ao.score, ao.score_fractions)

      this.canvasElement.addEventListener('pointerdown', () => this.canvasMouseDown())
      this.canvasElement.addEventListener('pointermove', (event) => this.canvasMouseMove(event))
      this.canvasElement.addEventListener('pointerup', () => this.canvasMouseUp())
      
    }

    renderSKEReviewAssessment(ao) {
      // update style and update content
      console.log("render ske review", ao)
      let takerMap = ao;

      if(takerMap.items){

        scoreSKEMap(takerMap, null);

        takerMap.items.forEach(item => {
        console.log(item);
          if(item.scoreStyles){
            Object.entries(item.scoreStyles).forEach(([gid, style]) => {
            //determine if node or link
            let ele = takerMap.nodes.find(x => x.id == gid) ? takerMap.nodes.find(x => x.id == gid) : takerMap.links.find(x => x.id == gid);
            //apply style
            if (ele){
              ele.style = style;
              ele.userStyle = style;
            }
          })
          }
          else {
            console.log("missing scorestyles", item)
          }
        })

        this.canvasElement.setAttribute("style", this.darkMode ? "background: black" : "background: white")
        let renderedAssessment = renderAssessment(takerMap, this, "review")
        console.log(renderedAssessment)
        this.canvasElement.append(renderedAssessment)
      }
    }

    renderBAMReviewAssessment(ao) {
      // add content and stlye
      console.log("renderBAMReview")
      ao.triples = formatBAMSubmittedTriples(ao)
      scoreBAMMap(ao);

      console.log("scored assessment", ao)

      this.canvasElement.setAttribute("style", this.darkMode ? "background: black" : "background: white")
      let renderedAssessment = renderAssessment(ao, this, "review")

      this.canvasElement.append(renderedAssessment)
      
    }

    displayReviewAnswers() {
      console.log("displayReviewAnswers")
    }

    renderAuthoringInitial() {
      // display an inital splash page for authoring
      // atm a general message
      let splashGroup = document.createElementNS(SVGNS, "g");
      splashGroup.setAttribute("transform", "translate(10, 20)")

      let mainText = document.createElementNS(SVGNS, "text");
      mainText.innerHTML = "To load an assessment, enter the Sero! Assessment ID..."

      splashGroup.append(mainText)

      this.canvasElement.append(splashGroup)
    }

    renderAuthoringError() {
      let splashGroup = document.createElementNS(SVGNS, "g");
      splashGroup.setAttribute("transform", "translate(10, 20)")

      let mainText = document.createElementNS(SVGNS, "text");
      mainText.innerHTML = "An error occured loading the Sero! Assessment ID. Please try again."

      splashGroup.append(mainText)

      this.canvasElement.append(splashGroup)
    }

  // FOOTER FNs
    toggleFooter(force) {
      let show = force !== undefined ? force : !this.displayFooter;
      this.displayFooter = show;
      this.footerElement.setAttribute("class", this.displayFooter ? this.darkMode ? "sero_footer_wrapper dark" : "sero_footer_wrapper" : "sero_footer_wrapper collapseFooter");
    }
  
  // GRAPH FNs
    setDimensions(w, h) {
      this.width = w;
      this.height = h;
    }
    selectNodes(nodes) {
      this.selectedLink = null;
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
        current.children[0].setAttribute("transform", "scale(1.2)")
        //console.log("select ", nodeId, current)
      })
    }
    selectLink(link) {
      this.selectNodes([])
      this.selectedLink = link;
    }
    clearTempGroup(){
      let g = this.canvasElement.querySelector(".assessment .temp_group") || this.canvasElement.querySelector(".review .temp_group")
      g.innerHTML = "";  
    }

    addNode(newNode, nodes){
      this.assessmentObject.nodes.push(newNode)
      let rendered = renderNode(newNode, this)
      this.setNodeEvents(rendered);
      
      this.canvasElement
        .querySelector(".assessment .node_group")
        .append(rendered)
    }

    deleteNode(nid, nodes) {
      nodes = nodes.filter(n => n.id !== nid)
      this.getElementByObjId(nid).remove()
    }

    addLink(newLink){
      this.assessmentObject.links.push(newLink)
      let rendered = renderLink(newLink, this.assessmentObject.nodes)
      this.setLinkEvents(rendered);

      this.canvasElement
        .querySelector(".assessment .link_group")
        .append(rendered)
    }

    deleteLink(lid) {
      let link = this.assessmentObject.links.find(e => e.id === lid);
      if(this.assessmentObject.type === "build-map"){
        this.assessmentObject.links = this.assessmentObject.links.filter(e => e.id !== lid)
        this.getElementByObjId(lid).remove()
      }
      else{
        let item = this.assessmentObject.items.find(x => x.id === link.assessmentId);
        if(item.type === "connectTo"){
          //console.log(item.config.userLinks.length, item.config.correctLinks.length)
          if(item.config.userLinks.length === item.config.correctLinks.length){
            this.addNode(link.connectNode, this.assessmentObject.nodes)
            this.addLink(link.connectLink)
          }
        }
        this.assessmentObject.links = this.assessmentObject.links.filter(e => e.id !== lid)
        this.getElementByObjId(lid).remove()
        this.removeUserLink(link.assessmentId, link.id)  
      }
      
    }

    startDeleteLink(link) {
      this.currentlyInteractingWith = "delete_button"
      this.toDelete = {nodes: [], links:[link.id]}        
    }

  // INTERACTION FNs
    setGraphEvents() {
      this.canvasElement.addEventListener('pointerdown', () => this.canvasMouseDown())
      this.canvasElement.addEventListener('pointermove', (event) => this.canvasMouseMove(event))
      this.canvasElement.addEventListener('pointerup', () => this.canvasMouseUp())
      //this.canvasElement.addEventListener('mouseout', () => this.canvasMouseOut())

      this.canvasElement.querySelectorAll(".bank").forEach(node => this.setBankEvents(node))
      this.canvasElement.querySelectorAll(".node").forEach(node => this.setNodeEvents(node))
      this.canvasElement.querySelectorAll(".link").forEach(link => this.setLinkEvents(link))
    }

    setNodeEvents(nodeEle) {
      nodeEle.addEventListener('pointerdown', (n) => this.nodeMouseDown(n))
      nodeEle.addEventListener('pointerup', (n) => this.nodeMouseUp(n))
    }

    setBankEvents(nodeEle) {
      nodeEle.addEventListener('pointerdown', (n) => this.bankMouseDown(n))
      nodeEle.addEventListener('pointerup', (n) => this.bankMouseUp(n))
    }

    setLinkEvents(linkEle) {
      linkEle.addEventListener('pointerover', (e) => this.linkMouseOver(e))
      linkEle.addEventListener('pointerdown', (e) => this.linkMouseDown(e))
      linkEle.addEventListener('pointerup', (e) => this.linkMouseUp(e))
      linkEle.addEventListener('pointerout', (e) => this.linkMouseOut(e))
    }

    // EVENT FNs
      canvasMouseDown() {
        //console.log("canvas mousedown")
        this.currentlyInteractingWith = this.currentlyInteractingWith || "canvas"
        if(this.currentlyInteractingWith === "canvas") this.clearTempGroup();
      }

      canvasMouseMove(event) {
        if(this.currentlyInteractingWith === "canvas") {
          GRAPH_TRANSFORM.x += event.movementX;
          GRAPH_TRANSFORM.y += event.movementY;

          let panZoomEle = this.canvasElement.querySelector(".assessment .panZoom_group") || this.canvasElement.querySelector(".review .panZoom_group")
          panZoomEle.setAttribute("transform", `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`)
        }
        else if(this.currentlyDragging){
          this.moveNode(this.currentlyDragging, event.movementX, event.movementY)
        }
      }

      canvasMouseUp() {
        //console.log("canvas mouseup")
        if(this.currentlyInteractingWith === "canvas" && this.selectedNodes.length > 0){
          this.selectNodes([])
        }
        if(this.currentlyInteractingWith === "delete_button"){
          //console.log("deleting...", this.toDelete)
          this.removeGraphContent(this.toDelete.nodes, this.toDelete.links)
          this.toDelete = {nodes: [], links: []}
        }

        //clear scale sizing
        this.clearScaleSizing()

        this.currentlyInteractingWith = null;
        this.currentlyDragging = null;
        this.mousedownNode = null;
        this.mousedownLink = null;
      }

      canvasMouseOut() {
        console.log("canvas mouseout")
      }

      nodeMouseDown(event) {
        this.clearTempGroup()
        let nodeId = event.target.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.nodes.find(n => n.id === nodeId)
        this.mousedownNode = nodeId
        //console.log("AM mousedown", nodeId)

        this.currentlyInteractingWith = this.currentlyInteractingWith || "node"

        if(["connect-to", "drag-drop", "build-drop"].includes(current.assessmentItem)){
          this.currentlyDragging = nodeId;
          let thisNode = this.getElementByObjId(nodeId)
          thisNode.setAttribute("style", "cursor: grabbing")
          console.log("set att", thisNode.style)

          if(current.assessmentItem !== "build-drop") {
            loadStaticFooter(this.footerElement, current.assessmentItem === "drag-drop" ? "dragDrop" : "connectTo");
            this.toggleFooter(true)
          }
        }
      }

      nodeMouseUp(event) {
        //console.log(this)
        let nodeId = event.target.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.nodes.find(n => n.id === nodeId)
        //console.log("AM mouseup", nodeId, this.currentlyInteractingWith)
        if(this.currentlyInteractingWith === "node"){
          if(current.assessmentItem && this.mousedownNode === nodeId){      
            this.triageSKEItemMouseUp(current)
          }
          else if(this.mousedownNode === nodeId){          
            //this.selectNodes([nodeId])               
          }
          else if(this.mousedownNode) {
            let mdn = this.assessmentObject.nodes.find(n => n.id === this.mousedownNode) || this.assessmentObject.bank.find(n => n.id === this.mousedownNode)
            if(["drag-drop", "build-drop"].includes(mdn.assessmentItem)) {
              this.triageSKEItemMouseUp(mdn) 
            }            
          }
        }        
      }

      bankMouseDown(event) {
        this.clearTempGroup()
        let nodeId = event.target.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.bank.find(n => n.id === nodeId)
        this.mousedownNode = nodeId
        console.log("bank mousedown")

        this.currentlyInteractingWith = this.currentlyInteractingWith || "node"

        if(["drag-drop", "bank-drop", "build-drop"].includes(current.assessmentItem)) {
          this.currentlyDragging = nodeId;

          if(current.reusable){
            console.log("create duplicate bank node")
          }

          if(["drag-drop", "bank-drop"].includes(current.assessmentItem)) {
            loadStaticFooter(this.footerElement, "dragDrop")
            this.toggleFooter(true)  
          }
          else if(current.assessmentItem === "build-drop") {
            // create copy of assessment item
          }
          
        }
      }

      bankMouseUp(event) {
        let nodeId = event.target.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.bank.find(n => n.id === nodeId)
        console.log("bank mouseup")
        if(this.currentlyInteractingWith === "node"){
          if(current.assessmentItem && this.mousedownNode === nodeId){      
            let inWordbank = BANK_TRANSFORM.y > current.y
            //console.log("c", inWordbank)
            if(current.reusable && inWordbank) {
              console.log("remove the duplicate")
            }

            this.triageSKEItemMouseUp(current)
          }
          else if(this.mousedownNode === nodeId){          
            //this.selectNodes([nodeId])               
            console.log("b")
          }
          else if(this.mousedownNode) {
            console.log("a")
          }
        }        
      }

      linkMouseOver() {
        let linkId = event.target.parentElement.getAttribute('data-sero-id') || event.target.parentElement.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.links.find(e => e.id === linkId)

        if(current && current.assessmentItem && current.assessmentItem === "arrow-direction"){
          let thisLink = this.getElementByObjId(linkId)
          thisLink.setAttribute("style", `stroke-width: 0.5em; stroke: #48a448; cursor: pointer`)
          thisLink.querySelector('.arrowhead_group > path').setAttribute("style", `fill: #48a448`)

          let otherLinkId = this.assessmentObject.links.find(e => e.id !== linkId && e.assessmentId && e.assessmentId === current.assessmentId).id
          let otherLink = this.getElementByObjId(otherLinkId)
          otherLink.setAttribute("style", `stroke-width: 0.2em`)
          otherLink.querySelector('.arrowhead_group > path').setAttribute("style", `fill: white`)

          if(current.style === "ad_default"){
            loadStaticFooter(this.footerElement, "arrowheadDirection")
            this.toggleFooter(true)
          }
        }        
      }

      linkMouseDown(event) {
        console.log("linkMouseDown")
        this.clearTempGroup()
        let linkId = event.target.parentElement.getAttribute('data-sero-id') || event.target.parentElement.parentElement.getAttribute('data-sero-id')
        //console.log("link mousedown", linkId)
        this.mousedownLink = linkId
        this.currentlyInteractingWith = this.currentlyInteractingWith || "link"
      }

      linkMouseUp(event) {
        //if connect-link -> display delete icon
        //if arrowhead -> select link
        console.log("linkMouseUp")
        if(this.currentlyInteractingWith === "link"){
          let linkId = event.target.parentElement.getAttribute('data-sero-id') || event.target.parentElement.parentElement.getAttribute('data-sero-id')
          let current = this.assessmentObject.links.find(e => e.id === linkId)
          //console.log("link mouseup", current, linkId)

          if(this.mousedownLink == linkId && current.assessmentItem && current.assessmentItem === "connect-link"){

            let coorNodes = getNodesByLink(current, this.assessmentObject.nodes)
            let targetCoors = SeroUtil.getCompassPoint(coorNodes.target, 2, 2)(coorNodes.source)
            let [mx, my] = SeroUtil.getMidpoint(coorNodes.source.x, coorNodes.source.y, targetCoors.x, targetCoors.y)

            let result = document.createElementNS(SVGNS, "image")
            result.setAttribute("height", "12pt")
            result.setAttribute("width", "12pt")
            result.setAttribute("x", mx - 6)
            result.setAttribute("y", my - 6)
            result.setAttribute("href", "assets/icons/linkDelete.svg")

            result.addEventListener("pointerdown", () => this.startDeleteLink(current))

            let tempGroup = this.canvasElement.querySelector(".assessment .temp_group")
            tempGroup.append(result)
          }
          else if(this.mousedownLink == linkId && current.assessmentItem && current.assessmentItem === "arrow-direction"){
            //let gObj = this.getElementByObjId(linkId)
            let item = this.assessmentObject.items.find(x => x.id === current.assessmentId)
            updateArrowDirection(item.id, current.id, this.assessmentObject.links, this)
            this.learnosityEvents.trigger('changed', this.assessmentObject);
            this.toggleFooter(false)
            this.redrawGraphContent()
          }
        }
      }

      linkMouseOut(event) {
        //if arrowhead -> unstyle
        let linkId = event.target.parentElement.getAttribute('data-sero-id') || event.target.parentElement.parentElement.getAttribute('data-sero-id')
        let current = this.assessmentObject.links.find(e => e.id === linkId)
        if(current && current.assessmentItem && current.assessmentItem === "arrow-direction"){
          let thisLink = this.getElementByObjId(linkId)
          thisLink.setAttribute("style", null)
          thisLink.querySelector('.arrowhead_group > path').setAttribute("style", null)

          let otherLinkId = this.assessmentObject.links.find(e => e.id !== linkId && e.assessmentId && e.assessmentId === current.assessmentId).id
          let otherLink = this.getElementByObjId(otherLinkId)
          otherLink.setAttribute("style", null)
          otherLink.querySelector('.arrowhead_group > path').setAttribute("style", null)
        }
      }
      

  // ITEMS
    triageSKEItemMouseUp(node) {
      if(["fill-in", "multi-choice", "error-detection"].includes(node.assessmentItem)) {
        this.loadItem(node)
      }
      else if(node.assessmentItem === "connect-to") {
        let connectItem = this.assessmentObject.items.find(z => z.id == node.assessmentId);
        let validateNode = (n) => n.id !== node.id && n.type !== node.type && (!connectItem.config.userLinks || !connectItem.config.userLinks.find(eid => this.assessmentObject.links.find(e => e.id === eid).target === n.id))
        let closestNode = SeroUtil.findList(node.x, node.y, this.assessmentObject.nodes, 80).filter(n => validateNode(n)).shift()
        //console.log(closestNode, connectItem.config)
        if(closestNode){

          let ctLink = this.assessmentObject.links.find(e => e.assessmentId === node.assessmentId && e.assessmentItem === "selector-link")
          let newLink = {
            id: SeroUtil.getGraphId(),
            type: closestNode.type === "concept" ? "target" : "source",
            source: node.parentNode,
            target: closestNode.id,
            assessmentItem: 'connect-link',
            assessmentId: node.assessmentId,
            style: 'connect-link',
            connectNode: node,
            connectLink: ctLink
          }
          //console.log("new link", newLink)

          this.addLink(newLink)
          this.addUserLink(node.assessmentId, newLink.id);

          //reposition connect-to node
          node.x = node.returnCoors ? node.returnCoors[0] : null
          node.y = node.returnCoors ? node.returnCoors[1] : null

          
          let removeConnect = connectItem.config.userLinks && connectItem.config.userLinks.length == connectItem.config.correctLinks.length;

          if(removeConnect){
            //console.log("remove connect-to node and link")
            this.assessmentObject.links = this.assessmentObject.links.filter(e => ctLink.id !== e.id);
            this.assessmentObject.nodes = this.assessmentObject.nodes.filter(n => node.id != n.id);
            let nEle = this.getElementByObjId(node.id)
            let lEle = this.getElementByObjId(ctLink.id)
            nEle.remove()
            lEle.remove()
          }

          this.learnosityEvents.trigger('changed', this.assessmentObject);
          this.toggleFooter(false)
          
        }
        else{
          node.x = node.returnCoors ? node.returnCoors[0] : null
          node.y = node.returnCoors ? node.returnCoors[1] : null
        }
        this.redrawGraphContent()
      }
      else if(node.assessmentItem === "drag-drop") {
        let item = this.assessmentObject.items.find(z => z.id == node.assessmentId);
        let isBankNode = this.assessmentObject.bank.find(n => n.id === node.id) ? true : false;
        let validateNode = (n) => n.id !== node.id && n.type !== node.type && n.assessmentItem !== "connect-to" && (!item.config.userLinks || !item.config.userLinks.find(eid => this.assessmentObject.links.find(e => e.id === eid).source === n.id))

        let checkX = isBankNode ? transformPointFromAToB(node.x, node.y, BANK_TRANSFORM, GRAPH_TRANSFORM).x : node.x
        let checkY = isBankNode ? transformPointFromAToB(node.x, node.y, BANK_TRANSFORM, GRAPH_TRANSFORM).y : node.y

        console.log([checkX, checkY], this.assessmentObject.nodes)
        let closestNode = SeroUtil.findList(checkX, checkY, this.assessmentObject.nodes, 80).filter(n => validateNode(n)).shift()
        if(closestNode){
          console.log(closestNode)

          node.x = checkX
          node.y = checkY

          if(this.assessmentObject.bank.find(n => n.id === node.id)){
            // move from bank -> node            
            this.assessmentObject.bank = this.assessmentObject.bank.filter(n => n.id !== node.id)
            let bEle = this.getElementByObjId(node.id)
            bEle.remove()
            
            this.addNode(node, this.assessmentObject.bank)
          }

          // new link
          let newLink = {
            id: SeroUtil.getGraphId(),
            type: closestNode.type === "relation" ? "target" : "source",
            source: closestNode.id,
            target: node.id,
            assessmentItem: 'connect-link',
            assessmentId: node.assessmentId,
            style: 'connect-link'
          }
          //console.log("new link", newLink)

          this.addLink(newLink)
          this.addUserLink(node.assessmentId, newLink.id);

          //reposition d&d node
          node.y = closestNode.y + closestNode.height*0.5 + 50

          this.learnosityEvents.trigger('changed', this.assessmentObject);
          this.toggleFooter(false)
          this.redrawGraphContent()
        }
        
      }
      else if(node.assessmentItem === "build-drop") {
        let isBankNode = this.assessmentObject.bank.find(n => n.id === node.id) ? true : false;
        let validateNode = (n) => n.id !== node.id && n.type !== node.type && !this.assessmentObject.links.find(e => e.source === n.id && e.target === node.id || e.source === node.id && e.target === n.id)

        let checkX = isBankNode ? transformPointFromAToB(node.x, node.y, BANK_TRANSFORM, GRAPH_TRANSFORM).x : node.x
        let checkY = isBankNode ? transformPointFromAToB(node.x, node.y, BANK_TRANSFORM, GRAPH_TRANSFORM).y : node.y

        let closestNode = SeroUtil.findList(checkX, checkY, this.assessmentObject.nodes, 80).filter(n => validateNode(n)).shift()
        if(closestNode){
          
          if(this.assessmentObject.bank.find(n => n.id === node.id)){
            // move from bank -> node            
            this.assessmentObject.bank = this.assessmentObject.bank.filter(n => n.id !== node.id)
            let bEle = this.getElementByObjId(node.id)
            bEle.remove()
            
            this.addNode(node, this.assessmentObject.bank)
          }

          // new link
          let newLink = {
            id: SeroUtil.getGraphId(),
            type: closestNode.type === "relation" ? "target" : "source",
            source: closestNode.id,
            target: node.id,
            assessmentItem: 'connect-link',
            assessmentId: node.assessmentId,
            style: 'connect-link'
          }
          //console.log("new link", newLink)

          this.addLink(newLink)

          //reposition d&d node
          node.y = closestNode.y + closestNode.height*0.5 + 50

          this.learnosityEvents.trigger('changed', this.assessmentObject);
          this.toggleFooter(false)
          this.redrawGraphContent()
        }
      }
    }

    loadItem(gObj) {
      let item = this.assessmentObject.items.find(x => x.id === gObj.assessmentId)
      //console.log("load item", item, gObj)
      if(item) {
        if(this.currentItem === item) {
          this.currentItem = null;
          this.toggleFooter();
          return
        }
        this.currentItem = item;

        if(["multiChoice", "errorCorrect", "errorDetection"].includes(item.type)) {
          let shuffled = SeroUtil.shuffle(item.config.choices.concat(item.config.correctAnswer));
          loadChoicesFooter(this, gObj, item)
          this.toggleFooter(true)
        }

        else if(item.type === "fillIn"){
          let formatted = item.config.userAnswer || item.config.correctAnswer.split("").map(() => "_").join("")
          loadFillInFooter(this, gObj, item, formatted)
          this.toggleFooter(true)
        }
        else if(item.type === "arrowDirection"){
          updateArrowDirection(item.id, gObj.id, this.assessmentObject.links, this)
          this.redrawGraphContent()
        }
      }
    }

    createConnectLink() {}

    addUserLink(itemId, linkId) {
      if(this.assessmentObject.items && this.assessmentObject.items.length > 0){
        //console.log(this.assessmentObject)
        let item = this.assessmentObject.items.find(x => x.id == itemId);
        item.config.userLinks = item.config.userLinks || [];
        if(!item.config.userLinks.includes(linkId)) item.config.userLinks.push(linkId);
      }
    }

    removeUserLink(itemId, linkId) {
      if(this.assessmentObject.items && this.assessmentObject.items.length > 0){
        let item = this.assessmentObject.items.find(x => x.id == itemId);
        item.config.userLinks = item.config.userLinks.filter(x => x !== linkId);
      }
    }

  // TOOLBAR
    zoomIn() {
      let panZoomGroup = this.canvasElement.querySelector(".panZoom_group")
      GRAPH_TRANSFORM.scale += 0.20;
      let panZoomTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`
      panZoomGroup.setAttribute("transform", panZoomTransform)
    }

    zoomOut() {
      let panZoomGroup = this.canvasElement.querySelector(".panZoom_group")
      GRAPH_TRANSFORM.scale -= 0.20;
      let panZoomTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`
      panZoomGroup.setAttribute("transform", panZoomTransform)
    }

    zoomToFit() {
      //simplre reset...
      let panZoomGroup = this.canvasElement.querySelector(".panZoom_group")
      GRAPH_TRANSFORM.x = 0;
      GRAPH_TRANSFORM.y = 0;
      GRAPH_TRANSFORM.scale = 1;
      let panZoomTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`
      panZoomGroup.setAttribute("transform", panZoomTransform) 
    }

  // UTIL
    getElementByObjId(oid) {
      return this.canvasElement.querySelector(`g[data-sero-id="${oid}"]`)
    }

    moveNode(nodeId, mx, my) {
      let bankToRedraw = this.assessmentObject.bank.filter(n => n.id === nodeId);
      let nodesToRedraw = this.assessmentObject.nodes.filter(n => n.id === nodeId);
      let linksToRedraw = this.assessmentObject.links.filter(e => e.source === nodeId || e.target === nodeId);
    
      bankToRedraw.forEach(n => {
        n.x += mx;
        n.y += my;
        let c = this.getElementByObjId(n.id);
        c.setAttribute("transform", `translate(${n.x}, ${n.y})`)
        this.highlightClosestNode(n, true);
        //if(n.assessmentItem && ["drag-drop"].includes(n.assessmentItem)) this.highlightClosestNode(n);
      })

      nodesToRedraw.forEach(n => {
        mx = mx / GRAPH_TRANSFORM.scale
        my = my / GRAPH_TRANSFORM.scale

        n.x += mx;
        n.y += my;
        let c = this.getElementByObjId(n.id);

        if(n.assessmentItem === "connect-to"){
          //rotate arrowhead
          let arrowhead = c.querySelector(".connectToArrowhead")
          let source = this.assessmentObject.nodes.find(z => z.id == n.parentNode)
          let ahRotate = SeroUtil.formatRotation(source, n)
          arrowhead.setAttribute("transform", `rotate(${ahRotate})`)
          this.highlightClosestNode(n)
        }
        else if(["drag-drop", "build-drop"].includes(n.assessmentItem)){
          this.highlightClosestNode(n)
        }
        c.setAttribute("transform", `translate(${n.x}, ${n.y})`)
      })

      linksToRedraw.forEach(e => {
        let c = this.getElementByObjId(e.id);
        let coorNodes = getNodesByLink(e, this.assessmentObject.nodes)

        // update line coors
        c.querySelectorAll(".line").forEach(link => {          
          link.setAttribute("d", getLinkCoors(coorNodes.source, coorNodes.target))          
        })

        //update arrowhead transform
        let ahEle = c.querySelector(".arrowhead_group")
        if(ahEle){
          let targetCoors = SeroUtil.getCompassPoint(coorNodes.target, 2, 2)(coorNodes.source)
          let arrowheadTranslate = `translate(${targetCoors.x}, ${targetCoors.y})`
          let rotDeg = SeroUtil.formatRotation(coorNodes.source, coorNodes.target) - 90
          let arrowheadRotate = `rotate(${rotDeg})`

          ahEle.setAttribute("transform", arrowheadTranslate)
          ahEle.querySelector("path").setAttribute("transform", arrowheadRotate)  
        }
        
      })
    }

    redrawGraphContent(nodesToRedraw, linksToRedraw) {
      nodesToRedraw = nodesToRedraw || this.assessmentObject.nodes;
      linksToRedraw = linksToRedraw || this.assessmentObject.links;

      nodesToRedraw.forEach(n => {
        let c = this.getElementByObjId(n.id);
        if(n.assessmentItem === "connect-to"){
          //rotate arrowhead
          let arrowhead = c.querySelector(".connectToArrowhead")
          let source = this.assessmentObject.nodes.find(z => z.id == n.parentNode)
          let ahRotate = SeroUtil.formatRotation(source, n)
          arrowhead.setAttribute("transform", `rotate(${ahRotate})`)
        }
        c.setAttribute("transform", `translate(${n.x}, ${n.y})`)
        let nodeTypes = ["node", n.type]
        if(n.assessmentItem) nodeTypes.push(n.style);
        let classes = nodeTypes.join(" ")
        c.setAttribute("class", classes)
      })

      linksToRedraw.forEach(e => {
        let c = this.getElementByObjId(e.id);
        let coorNodes = getNodesByLink(e, this.assessmentObject.nodes)

        let linkTypes = ["link", e.type]
        if(e.assessmentItem) linkTypes.push(e.style);
        let classes = linkTypes.join(" ")
        c.setAttribute("class", classes)

        c.querySelectorAll(".line").forEach(link => {          
          link.setAttribute("d", getLinkCoors(coorNodes.source, coorNodes.target))          
        })
        if(e.type === "target"){
          redrawArrowhead(c, coorNodes.source, coorNodes.target)  
        }
        
      })
    }

    removeGraphContent(nodesToRemove, linksToRemove) {
      nodesToRemove.forEach(x => this.deleteNode(x, this.assessmentObject.nodes))
      linksToRemove.forEach(x => this.deleteLink(x))
      this.clearTempGroup()
      this.redrawGraphContent()
    }

    checkTextWidth(textToMeasure) {
      let checkText = this.canvasElement.querySelector("g[data-sero-checktext] > text")
      checkText.innerHTML = textToMeasure;
      return checkText.getComputedTextLength()
    }

    updateNodeDisplayValue(d, newValue){      
      let ele = this.getElementByObjId(d.id)
      let eleText = ele.querySelector("text")

      if(d.assessmentItem && d.assessmentItem === "multi-choice"){
        delete d.icon
        let img = ele.querySelector("image")
        if(img) {
          img.remove();
          ele.querySelector('rect').remove();
        }
        if(!eleText) {
          eleText = document.createElementNS(SVGNS, "text");
          eleText.setAttribute("visibility", "visible")
          eleText.setAttribute("y", 0)
          ele.appendChild(eleText)
        }
      }

      d.displayValue = newValue
      this.setFormattedText(d)
      
      let nodeTranslate = `translate(${d.x},${d.y})`

      ele.setAttribute("transform", nodeTranslate)
      ele.innerHTML = renderNode(d, this).innerHTML
    }

    setFormattedText(node) {
      let checkTextG = this.canvasElement.querySelector("g[data-sero-checktext]") 
      let checkText = checkTextG.querySelector("text")
      checkText.innerHTML = "";

      //console.log(checkTextG, checkText)

      node.formattedText = SeroUtil.chunkNodeText(node, checkText);      
      node.formattedText.forEach((x,i) => {
        let chunkText = x.chunks.join(" ")
        if(chunkText.trim().length > 0){
          let tspan = document.createElementNS(SVGNS, "tspan");
          tspan.setAttribute("dy", i == 0 ? 4 : 14)
          tspan.setAttribute("x", 0)
          tspan.innerHTML = chunkText
          checkText.appendChild(tspan)
        }
      })

      let resultBB = checkTextG.getBoundingClientRect()
      //console.log(`bbox ${node.value}`, resultBB)
      
      let pad = node.type == 'relation' ? [2, 2] : [4, 4]
      node.height = resultBB.height + pad[1]
      node.width = resultBB.width + pad[0]
      //console.log("setFormattedText", node.width, node.height)
    }

    highlightClosestNode(d, isBankNode) {
      let checkDistance = 100;
      let dx = isBankNode ? transformPointFromAToB(d.x, d.y, BANK_TRANSFORM, GRAPH_TRANSFORM).x : d.x;
      let dy = isBankNode ? transformPointFromAToB(d.x, d.y, BANK_TRANSFORM, GRAPH_TRANSFORM).y : d.y;

      if(this.assessmentObject.type === "skeleton-map") {
        let currItem = this.assessmentObject.items.find(item => item.id == d.assessmentId);
        let connectedNodes = [];

        if(currItem && currItem.config && currItem.config.userLinks){
          let userLinks = currItem.config.userLinks;
          userLinks.forEach(linkId => {
            connectedNodes.push(this.assessmentObject.links.find(l => l.id == linkId).target.id);
          })
        }

        let isSelectable = (x) => 
          x.id != d.id && 
          x.type != d.type && 
          !(x.assessmentItem && x.assessmentItem == "connect-to") && 
          !(x.assessmentItem && x.assessmentItem == "drag-drop") && 
          !connectedNodes.includes(x.id) && !isParent(x);

        let isParent = (t) => this.assessmentObject.links.find(x => SeroUtil.getLinkId(x.target) === d.parentNode && SeroUtil.getLinkId(x.source) === t.id) ? true : false;

        let closestNode = this.assessmentObject.nodes
          .filter(x => isSelectable(x) && SeroUtil.getDistance(x.x, x.y, dx, dy) < checkDistance)
          .sort((a,b) => SeroUtil.getDistance(a.x, a.y, dx, dy) - SeroUtil.getDistance(b.x, b.y, dx, dy))
          .shift();


        this.assessmentObject.nodes.forEach(n => {
          let temp = this.getElementByObjId(n.id)
          if(temp.querySelector('text')) temp.querySelector('text').removeAttribute('transform');
          if(temp.querySelector('rect')) temp.querySelector('rect').removeAttribute('transform');

          if(closestNode && closestNode.id === n.id){
            if(temp.querySelector('text')) temp.querySelector('text').setAttribute('transform', 'scale(1.4)');
            if(temp.querySelector('rect')) temp.querySelector('rect').setAttribute('transform', 'scale(1.4)');    
          }
        })
      }
      else {
        let isParent = (t) => this.assessmentObject.links.find(x => SeroUtil.getLinkId(x.target) === d.parentNode && SeroUtil.getLinkId(x.source) === t.id) ? true : false;
        let isSelectable = (x) => 
          x.id != d.id && 
          x.type != d.type && 
          !isParent(x);
        
        let closestNode = this.assessmentObject.nodes
          .filter(x => isSelectable(x) && SeroUtil.getDistance(x.x, x.y, dx, d.y) < checkDistance)
          .sort((a,b) => SeroUtil.getDistance(a.x, a.y, dx, d.y) - SeroUtil.getDistance(b.x, b.y, dx, d.y))
          .shift();


        this.assessmentObject.nodes.forEach(n => {
          let temp = this.getElementByObjId(n.id)
          if(temp.querySelector('text')) temp.querySelector('text').removeAttribute('transform');
          if(temp.querySelector('rect')) temp.querySelector('rect').removeAttribute('transform');

          if(closestNode && closestNode.id === n.id){
            if(temp.querySelector('text')) temp.querySelector('text').setAttribute('transform', 'scale(1.4)');
            if(temp.querySelector('rect')) temp.querySelector('rect').setAttribute('transform', 'scale(1.4)');    
          }
        })
      }
      
    }

    clearScaleSizing() {
      this.assessmentObject.nodes.forEach(n => {
        let temp = this.getElementByObjId(n.id)
        if(temp.querySelector('text')) temp.querySelector('text').removeAttribute('transform');
        if(temp.querySelector('rect')) temp.querySelector('rect').removeAttribute('transform');
      })
    }
}

//---------
const SVGNS = "http://www.w3.org/2000/svg"

let GRAPH_TRANSFORM = { x: 0, y: 0, scale: 1 }
let BANK_TRANSFORM  = { x: 0, y: 0, scale: 1 }

function transformPointFromAToB(px, py, TA, TB) {
  //convert point {px, py} from TA -> TB
  //console.log(px, py, TA, TB)

  let tx = (px - TA.x) / TA.scale;
  let ty = (py - TA.y) / TA.scale;

  let rx = tx * (1/TB.scale) - TB.x;
  let ry = ty * (1/TB.scale) - TB.y;

  //console.log("tx", tx, ty)

  return {x: rx, y: ry}
}

// UI Text
  let takerInstructionMap = {
    multiChoice: {
      'itemType': 'multi-choice',
      'title': 'Multiple choice',
      'instruction': 'Select the correct answer. '
     },
    fillIn: {
      'itemType': 'fill-in',
      'title': 'Fill-in',
      'instruction': 'Type the answer into the blank space. ',
      'detail': 'Uppercase, lowercase, singular, and plural are all acceptable.'
    },
    errorCorrect: {
      'itemType': 'error-correct',
      'title': 'Error correct',
      'instruction': 'This part of the map may be incorrect. If so, select an option to correct it.'
    },
    errorDetection: {
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
  
  function renderAssessment(ao, that, type) {
    type = type || "assessment";

    console.log(ao)

    // render 
      let assessmentGroup = document.createElementNS(SVGNS, "g");
      assessmentGroup.setAttribute("transform", "translate(0, 0)")

      let bankGroup = document.createElementNS(SVGNS, "g");
      bankGroup.setAttribute("class", "word_bank_group")

      let panZoomGroup = document.createElementNS(SVGNS, "g");
      panZoomGroup.setAttribute("class", "panZoom_group")

      let nodeGroup = document.createElementNS(SVGNS, "g");
      nodeGroup.setAttribute("class", "node_group")

      let linkGroup = document.createElementNS(SVGNS, "g");
      linkGroup.setAttribute("class", "link_group")

      let tempGroup = document.createElementNS(SVGNS, "g");
      tempGroup.setAttribute("class", "temp_group")

      ao.nodes.forEach(node => nodeGroup.append(renderNode(node, that)))
      ao.links.forEach(link => linkGroup.append(renderLink(link, ao.nodes)))

      let bankSize = SeroUtil.arrangeNodesInRows([800, 100], [10, 10], ao.bank)
      //SeroUtil.resetNodePositions(ao.bank)
      console.log("about to arrange bank...", bankSize)

      BANK_TRANSFORM.x += 10;
      BANK_TRANSFORM.y += 20 + bankSize[1] + 14;

      GRAPH_TRANSFORM.x += 20;
      GRAPH_TRANSFORM.y += ao.bank.length > 0 ? 100 + BANK_TRANSFORM.y : BANK_TRANSFORM.y;

      bankGroup.setAttribute("transform", `translate(${BANK_TRANSFORM.x}, ${BANK_TRANSFORM.y}) scale(${BANK_TRANSFORM.scale})`)

      ao.bank.forEach(node => {
        //console.log("bank node", node)
        let nodeEle = document.createElementNS(SVGNS, "g");
        let classes = `bank ${node.type} dragDrop`
        let nodeTranslate = `translate(${node.x},${node.y})`
        nodeEle.setAttribute("data-sero-id", node.id)
        nodeEle.setAttribute("class", classes)
        nodeEle.setAttribute("transform", nodeTranslate)
        that.setFormattedText(node)
        nodeEle.appendChild(getNodeRect(node))
        nodeEle.appendChild(getNodeText(node, that))
        
        bankGroup.appendChild(nodeEle)
      })

      console.log("size of bank group...", bankGroup)

    assessmentGroup.setAttribute("class", that.darkMode ? `${type} dark` : type)
    let panZoomTransform = `translate(${GRAPH_TRANSFORM.x}, ${GRAPH_TRANSFORM.y}) scale(${GRAPH_TRANSFORM.scale})`

    panZoomGroup.setAttribute("transform", panZoomTransform)
    panZoomGroup.append(linkGroup, nodeGroup, tempGroup)
    assessmentGroup.append(bankGroup, panZoomGroup)
    
    return assessmentGroup
  }

  function renderNode(node, that){
    let nodeEle = document.createElementNS(SVGNS, "g");
    let nodeTypes = node.assessmentItem ? ["node", node.type, node.style] : ["node", node.type];

    nodeEle.setAttribute("class", nodeTypes.join(" "))
    nodeEle.setAttribute("transform", `translate(${node.x},${node.y})`)
    nodeEle.setAttribute("data-sero-id", node.id)   
          
    if(node.assessmentItem === "multi-choice") {
      if(that.graphType === "assessment" && node.icon){
        let icon = getMCIcon(node)
        nodeEle.appendChild(getNodeRect(node))
        nodeEle.appendChild(icon)
      }
      else {
        that.setFormattedText(node)
        nodeEle.appendChild(getNodeRect(node))
        nodeEle.appendChild(getNodeText(node, that))  
      }
    }
    else if(node.assessmentItem === "connect-to") {
      let sourceNode = that.assessmentObject.nodes.find(n => n.id == node.parentNode)
      nodeEle.innerHTML = getConnectToArrowhead(node, sourceNode)
    }
    else {
      that.setFormattedText(node)
      nodeEle.appendChild(getNodeRect(node))
      nodeEle.appendChild(getNodeText(node, that))
      
      
    }

    return nodeEle
  }

  function renderLink(link, nodes) {
    let linkNodes = getNodesByLink(link, nodes)
    let coorString = getLinkCoors(linkNodes.source, linkNodes.target)
    let linkTypes = ["link", link.type]
    if(link.style) linkTypes.push(link.style);    
    let classes = linkTypes.join(" ")

    let linkEle = document.createElementNS(SVGNS, "g");
    linkEle.setAttribute("data-sero-id", link.id)
    linkEle.setAttribute("class", classes)

    let linePath = document.createElementNS(SVGNS, "path");
    linePath.setAttribute("d", coorString)
    linePath.setAttribute("class", "line")

    let areaPath = document.createElementNS(SVGNS, "path");
    areaPath.setAttribute("class", "line action_area")
    areaPath.setAttribute("style", "opacity:0;stroke-width:1em;")
    areaPath.setAttribute("d", coorString)
    areaPath.setAttribute("pointer-events", "all")

    linkEle.append(linePath, areaPath)

    if(link.type === "target"){
      let arrowheadGroup = document.createElementNS(SVGNS, "g");
      let targetCoors = SeroUtil.getCompassPoint(linkNodes.target, 2, 2)(linkNodes.source)
      let arrowheadTranslate = `translate(${targetCoors.x}, ${targetCoors.y})`
      let rotDeg = SeroUtil.formatRotation(linkNodes.source, linkNodes.target) - 90
      let arrowheadRotate = `rotate(${rotDeg})`
      //let arrowheadPathCoors = `M0,-5L10,0L0,5Z`
      let arrowheadPathCoors = link.assessmentItem && link.assessmentItem === "arrow-direction" ? `M0,0L-8,-12L-10,-12L-10,12L-8,12Z` : `M0,0L-10,5L-10,-5Z`;

      arrowheadGroup.setAttribute("class", "arrowhead_group")
      arrowheadGroup.setAttribute("transform", arrowheadTranslate)
      //arrowheadGroup.setAttribute("fill", "#778899")
      let arrowheadPath = document.createElementNS(SVGNS, "path");
      arrowheadPath.setAttribute("d", arrowheadPathCoors)
      arrowheadPath.setAttribute("transform", arrowheadRotate)
      arrowheadGroup.append(arrowheadPath)
      linkEle.append(arrowheadGroup)
    }
    
    return linkEle
  }

  function redrawArrowhead(ele, sourceNode, targetNode){
    //console.log(ele)
    let arrowheadGroup = ele.querySelector(".arrowhead_group")
    let targetCoors = SeroUtil.getCompassPoint(targetNode, 2, 2)(sourceNode)
    let arrowheadTranslate = `translate(${targetCoors.x}, ${targetCoors.y})`
    let rotDeg = SeroUtil.formatRotation(sourceNode, targetNode) - 90
    let arrowheadRotate = `rotate(${rotDeg})`

    arrowheadGroup.setAttribute("transform", arrowheadTranslate)
    
    let arrowheadPath = arrowheadGroup.querySelector("path")
    arrowheadPath.setAttribute("transform", arrowheadRotate)
  }

  function getNodeRect(node) {
    let rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("visibility", node.style === 'none' ? 'hidden' : 'visible')
    rect.setAttribute("width", node.width + 2)
    rect.setAttribute("height", node.height + 2)
    rect.setAttribute("x", -node.width/2 - 1)
    rect.setAttribute("y", -node.height/2 - 1)
    return rect
  }

  function getNodeText(node, that) {
    // node.formattedText = [{yPosition: number, chunks: [string], width: number}]
    let text = document.createElementNS(SVGNS, "text");
    text.setAttribute("visibility", node.style === 'none' ? 'hidden' : 'visible')

    if(node.formattedText){
      text.setAttribute("y", getNodeTextYPosition(node))

      getNodeTextTspans(node).forEach(x => {
        text.appendChild(x)
      })
    }
    else {
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
      return -18
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
      let tspan = document.createElementNS(SVGNS, "tspan");
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
    
    if(targetNode.assessmentItem && targetNode.assessmentItem === "connect-to"){
      return `M${sourceNode.x},${sourceNode.y}L${targetNode.x},${targetNode.y}`
    }
    //
    let compass = SeroUtil.getCompassPoint(targetNode, 2, 2)(sourceNode)
    //console.log(compass)

    return `M${sourceNode.x},${sourceNode.y}L${compass.x},${compass.y}`
  }

// FOOTER FNs

  function getFooterContent() {
    let result = document.createElement('div')
    result.setAttribute("class", "sero_footer_footerContent")

    let title = document.createElement("p")
    title.setAttribute("class", "sero_footer_title")

    let instr = document.createElement("div")
    instr.setAttribute("class", "sero_footer_instruction")
    
    let cont = document.createElement("div")
    cont.setAttribute("class", "sero_footer_container")

    result.append(title, instr, cont)
    return result
  }

  function loadStaticFooter(ele, type) {
    let info = takerInstructionMap[type]
    ele.querySelector(".sero_footer_title").innerHTML = info.title

    let instr = ele.querySelector(".sero_footer_instruction")
    instr.innerHTML = "";
    let textContainer = document.createElement("div")
    textContainer.setAttribute("class", "sero_footer_instrText")
    let single = document.createElement("p")
    single.setAttribute("class", "sero_footer_textSingle")
    single.innerHTML = info.instruction
    textContainer.append(single)
    
    if(info.detail){
      let detail = document.createElement("p")
      detail.setAttribute("class", "sero_footer_detail")
      detail.innerHTML = info.detail
      textContainer.append(detail)
    }
    instr.append(textContainer)

    ele.querySelector(".sero_footer_container").innerHTML = ""
  }

  function loadFillInFooter(that, node, item, displayText) {
    let ele = that.footerElement
    let type = "fillIn"
    let titleE = ele.querySelector(".sero_footer_title")
    titleE.innerHTML = takerInstructionMap[type].title
    
    let instructionE = ele.querySelector(".sero_footer_instruction")
    instructionE.innerHTML = "";

    let instructText = document.createElement("p")
    instructText.setAttribute("class", "sero_footer_textDouble")
    instructText.innerHTML = takerInstructionMap[type].instruction
    instructionE.appendChild(instructText)

    if(takerInstructionMap[type].detail){
      let detailText = document.createElement("p")
      detailText.setAttribute("class", "sero_footer_detail")
      detailText.innerHTML = takerInstructionMap[type].detail
      instructionE.appendChild(detailText)
    }

    let containerE = ele.querySelector(".sero_footer_container")
    containerE.innerHTML = "";

    let textarea = document.createElement("textarea")
    textarea.setAttribute("rows", 10)
    textarea.setAttribute("cols", 30)
    textarea.setAttribute("sero-footer-text", true)
    textarea.addEventListener("blur", (e) => { 
      e.preventDefault();
      submitFillIn(that, node)
  })
    textarea.addEventListener("keypress", (e) => {
      if(e.key === "Enter") {
        e.preventDefault();
        submitFillIn(that, node)
      }
    })
    textarea.placeholder = node.displayValue || node.value

    let lDivide = document.createElement("div")
    lDivide.setAttribute("class", "leftDivider")
    lDivide.appendChild(textarea)
    containerE.appendChild(lDivide)
  }

  function submitFillIn(that, node) {
    let result = that.footerElement.querySelector("textarea[sero-footer-text='true']").value
    console.log(result)
    if(typeof result === "string" && result.length > 0){
      that.updateNodeDisplayValue(node, result)
      let item = that.assessmentObject.items.find(x => x.id === node.assessmentId);
      updateUserAnswer(item, result)
      that.learnosityEvents.trigger('changed', that.assessmentObject);
      that.toggleFooter(false)
    }
    
  }

  function loadChoicesFooter(that, node, item) {
    let ele = that.footerElement
    let choiceStrings = SeroUtil.shuffle(item.config.choices.concat(item.config.correctAnswer));
    let type = item.type


    let titleE = ele.querySelector(".sero_footer_title")
    titleE.innerHTML = takerInstructionMap[type].title

    let instructionE = ele.querySelector(".sero_footer_instruction")
    instructionE.innerHTML = "";

    let containerE = ele.querySelector(".sero_footer_container")
    containerE.innerHTML = "";
    
    let instructText = document.createElement("p")
    instructText.setAttribute("class", type === "multiChoice" ? "sero_footer_textSingle" : "sero_footer_textDouble")
    instructText.innerHTML = takerInstructionMap[type].instruction
    instructionE.appendChild(instructText)

    if(takerInstructionMap[type].detail){
      let detailText = document.createElement("p")
      detailText.setAttribute("class", "sero_footer_detail")
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
        if(item.type === "multiChoice") submitMCChoice(that, node, choice);
        else if(item.type === "errorDetection") submitErrorCorrectChoice(that, node, choice);
      })
      pills.appendChild(r)
    })

  }

  function submitMCChoice(that, node, choice){
    let item = that.assessmentObject.items.find(x => x.id === node.assessmentId)
    updateUserAnswer(item, choice)
    delete node.icon;
    that.updateNodeDisplayValue(node, choice)
    let linksToRedraw = that.assessmentObject.links.filter(e => e.source === node.id || e.target === node.id)
    that.redrawGraphContent([], linksToRedraw)
    that.learnosityEvents.trigger('changed', that.assessmentObject);
    that.toggleFooter(false)
  }

  function submitErrorCorrectChoice(that, node, choice){
    let item = that.assessmentObject.items.find(x => x.id === node.assessmentId)
    updateUserAnswer(item, choice)
    that.updateNodeDisplayValue(node, choice)
    let linksToRedraw = that.assessmentObject.links.filter(e => e.source === node.id || e.target === node.id)
    that.redrawGraphContent([], linksToRedraw)
    that.learnosityEvents.trigger('changed', that.assessmentObject);
    that.toggleFooter(false)
  }

  function updateUserAnswer(item, newValue) {
    newValue = newValue && newValue.length > 0 ? newValue : null
    item.config.userAnswer = newValue;
  }

// TOOLBAR FNs
  let toolbarData = {
    zoomIn: {
      alt: "Zoom in",
      title: "Zoom in",
      src: "assets/icons/zoomIn.svg",
      fn: undefined
    },
    zoomOut: {
      alt: "Zoom out",
      title: "Zoom out",
      src: "assets/icons/zoomOut.svg",
      fn: undefined
    },
    zoomToFit: {
      alt: "Zoom to fit",
      title: "Zoom to fit",
      src: "assets/icons/fitScreen.svg",
      fn: undefined
    }
  }


  function getTBItem(type) {

  }

  function setToolbarTitle(assessmentName, scoreNumber, scoreFractions) {
    console.log("setToolbarTitle")
    let titleContainer = document.querySelector('.sero_toolbar > .titleTaker')
    titleContainer.innerHTML = '';

    let title = document.createElement('p')
    title.setAttribute("class", "assignTitle light")
    title.innerHTML = assessmentName
    title.title = assessmentName;
    titleContainer.append(title)

    if(scoreNumber) {
      let score = document.createElement('p')
      score.setAttribute("class", "testInfoVisible")
      score.innerHTML = `<span class="score">Score: ${scoreFractions}, ${scoreNumber}%</span>`
      titleContainer.append(score)  
    }
  }

// STYLE FNs
  function styleBAMAssessment(ao, rowDimensions, that) {            
    console.log("styleBuildMap", ao.settings)
    ao.bank = ao.bank || []
    ao.links = []
    let isConnected = (x) => ao.links.find(y => y.source == x.id || y.target == x.id)

    ao.nodes.sort((a,b) => {
      //if(a.type != b.type) return a.type == "concept" ? 1 : -1;
      return Math.random() - Math.random()
    })

    let isReusable = ao.settings.reusableLP;
    if(isReusable){
      ao.nodes.filter(n => n.type == 'relation')
        .forEach(n => {
          if(!ao.bank.find(b => b.value === n.value)){
            let bi = newBuildDropBankItem(n, isReusable)
            ao.bank.push(bi)
          }
          if(!isConnected(n)) styleHiddenItem(n);
        })
      
      ao.nodes.filter(n => n.type == 'concept')
        .forEach(n => {
          styleBuildDropGraphItem({id: "build-a-map"}, n)
        })

      ao.nodes = ao.nodes.filter(n => n.style !== "hidden")
    }
    else {
      ao.nodes.forEach(n => {
        styleBuildDropGraphItem({id: "build-a-map"}, n)
      })
    }
            
    let scaledWidth = rowDimensions[0]*0.8;
    let scaledHeight = rowDimensions[1];

    if(ao.bank.length > 0){
      SeroUtil.arrangeNodesInRows([scaledWidth, scaledHeight], [40, 40], ao.bank)
    }

    if(ao.links.length == 0) {
      let firstRow = SeroUtil.arrangeNodesInRows([scaledWidth, scaledHeight], [40, 40], ao.nodes.filter(n => n.type == "concept"))
      SeroUtil.arrangeNodesInRows([scaledWidth, scaledHeight], [40, 40], ao.nodes.filter(n => n.type == "relation"))
      
      ao.nodes.filter(n => n.type == "relation").forEach(n => {
        n.y += firstRow[1] + 120;
      })
    }
    console.log("styled assessment")
  }

    // BAM
      function styleBuildDropItem(item, node) {
        node.style = 'buildDrop'
        node.assessmentItem = 'drag-drop'
        node.assessmentId = item.id
      }

      function styleBuildDropGraphItem(item, node) {
        node.style = 'buildDrop'
        node.assessmentItem = 'build-drop'
        node.assessmentId = item.id
      }

      function newBuildDropBankItem(node, isReusable) {

        return {
          id: node.id,
          value: node.value,
          style: 'buildDrop',
          assessmentItem: 'build-drop',
          type: node.type,
          assessmentId: "build-a-map",
          reusable: isReusable
        }
      }

  function styleSKEAssessment(ao){
    ao.bank = ao.bank || []

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
      node.formattedText.forEach(ft => {
        ft.chunks = ft.chunks.map(x => x.split("").map(() => node.showHint ? "_" : " ").join(""))
      })
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

      let result = document.createElementNS(SVGNS, "image")
      result.setAttribute("height", d.height)
      result.setAttribute("width", d.width)
      result.setAttribute("x", -d.width/2)
      result.setAttribute("y", -d.height/2)
      result.setAttribute("href", d.icon)
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

    function clickErrorCorrect(that, node, item){
      loadChoicesFooter(that, item, node);
    }

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
            let ny = n.y + n.height/2 + 20
            nodes.push({
              id: x+"-->",
              value: "-->",
              type: n.type,
              x: n.x,
              y: ny,
              returnCoors: [n.x, ny],
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

    function getConnectToArrowhead(node, source) {
      let d = SeroUtil.getPentagonCoors(0, 0, 26)
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

          //console.log("styled drag items", dropItem, nodes, links, bank); 
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
          originalX: node.x,
          y: node.y,
          originalY: node.y,
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

    function updateArrowDirection(itemId, targetLinkId, links, that) {
      let item = that.assessmentObject.items.find(x => x.id == itemId)
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

// SCORE STYLE GNs
  function scoreSKEMap(takerMap, masterMap) {
    let current = 0;
    let total = 0;

    takerMap.nodes = takerMap.nodes.concat(takerMap.bank)
    takerMap.bank = []
    
    takerMap.items.forEach(item => {
      setScoreStyles(item, takerMap, masterMap);
      current += item.score
      if(item.type === "connectTo") total += item.config.correctLinks.length;
      else if (item.type === "dragDrop") total += item.config.correctLinks.length;
      else total += 1;
    })

    let formatted = (current / total ) * 100;
    takerMap.score_fractions = `${current}/${total}`;
    takerMap.score = formatted == 100 ? "100" : formatted == 0 ? "0" : formatted < 10 ? formatted.toPrecision(1) : formatted.toPrecision(2);
    console.log(total, takerMap.items.length, formatted)
  }

  function scoreBAMMap(takerMap) {
    //score 
    let result = 0
    let rawTriples = takerMap.settings.rawTriples
    
    //console.log("score build map", rawTriples)
    function isContainedIn(sourceTriples, targetTriple) {
      return sourceTriples.find(refTriple => refTriple.config.subId == targetTriple.config.subId && refTriple.config.relId == targetTriple.config.relId && refTriple.config.objId == targetTriple.config.objId);
    }

    takerMap.triples.forEach(triple => {

      let containedIn = isContainedIn(rawTriples, triple)
      let isIncorrect = rawTriples.find(refTriple => refTriple.config.subId == triple.config.subId && refTriple.config.relId !== triple.config.relId && refTriple.config.objId == triple.config.objId);
      
      result += containedIn ? 1 : 0;

      Object.entries(triple.config).forEach(([key, id]) => {
        if(["sourceId", "targetId"].includes(key)){
          takerMap.links.find(z => z.id == id).style = containedIn ? "correct" : "incorrect"; 
        }
        else if(key == "relId"){
          //takerMap.nodes.find(z => z.id == id).style = containedIn ? "correct" : "unanswered";
        }
      })

    })

    // add missing triples here
    // ...
    rawTriples.forEach(rawTriple => {
      let containedIn = isContainedIn(takerMap.triples, rawTriple)
      if(!containedIn) {
        //console.log("takerMap is missing", rawTriple.value)
        if(!takerMap.links.find(e => SeroUtil.getNodeId(e.source) === rawTriple.config.subId && SeroUtil.getNodeId(e.target) === rawTriple.config.relId)) {
          //console.log("source link is missing")
          let missingLink = {
            id: rawTriple.config.sourceId,
            source: rawTriple.config.subId,
            target: rawTriple.config.relId,
            type: "source",
            style: "missing"
          }
          takerMap.links.push(missingLink)
        }

        if(!takerMap.links.find(e => SeroUtil.getNodeId(e.source) === rawTriple.config.relId && SeroUtil.getNodeId(e.target) === rawTriple.config.objId)) {
          //console.log("target link is missing")
          let missingLink = {
            id: rawTriple.config.targetId,
            source: rawTriple.config.relId,
            target: rawTriple.config.objId,
            type: "target",
            style: "missing"
          }
          takerMap.links.push(missingLink)
        }
      }
    })

    //console.log("build-map score", result, rawTriples)
    let formatted = result / rawTriples.length * 100;
    takerMap.score_fractions = `${result}/${rawTriples.length}`
    takerMap.score = formatted == 100 ? "100" : formatted == 0 ? "0" : formatted < 10 ? formatted.toPrecision(1) : formatted.toPrecision(2);
  }

  function formatBAMSubmittedTriples(takerMap) {
    // create takerMap.triples object from links

    let takerTriples = takerMap.links
      .filter(e => e.type === "source")
      .reduce((s,e) => {
        let targets = takerMap.links.filter(te => te.type === "target" && SeroUtil.getNodeId(e.target) === SeroUtil.getNodeId(te.source))
        targets.forEach(te => {
          s.push({
            config: {
              subId: SeroUtil.getNodeId(e.source),
              relId: SeroUtil.getNodeId(e.target),
              objId: SeroUtil.getNodeId(te.target),
              sourceId: e.id,
              targetId: te.id
            }, 
            value: [
              takerMap.nodes.find(n => n.id === SeroUtil.getNodeId(e.source)).value,
              takerMap.nodes.find(n => n.id === SeroUtil.getNodeId(e.target)).value,
              takerMap.nodes.find(n => n.id === SeroUtil.getNodeId(te.target)).value
            ]
          })
        })
        return s
      },[])

    console.log(takerTriples)
    return takerTriples
  }

  function setScoreStyles(item, takerMap, referenceMap) {
    console.log(item)
    switch(item.type) {
      case 'multiChoice':
        {
        let answer = item.config.userAnswer ? checkMultiChoice(item.config.correctAnswer, item.config.userAnswer) : 'unanswered';
        item.scoreStyles = Object.keys(item.styles).reduce((s,c) => {
          s[c] = answer;
          return s
        }, {});
        item.score = answer == "correct" ? 1 : 0;
        }
        break;
      case 'fillIn':
        {
        let answer = item.config.userAnswer ? checkFillIn(item.config.correctAnswer, item.config.userAnswer, item.config.choices) : 'unanswered';
        if(answer === 'unanswered'){
          //takerMap.nodes.find(n => n.id === item.targetId).value = item.config.correctAnswer;
          delete takerMap.nodes.find(n => n.id === item.targetId).displayValue;
        }

        item.scoreStyles = Object.keys(item.styles).reduce((s,c) => {
          s[c] = answer;
          return s
        }, {});
        item.score = answer == "correct" ? 1 : 0;
        }
        break;
      case 'errorDetection':
        {
        let answer = item.config.userAnswer ? checkErrorDetection(item.config.correctAnswer, item.config.userAnswer) : 'unanswered';
        item.scoreStyles = Object.keys(item.styles).reduce((s,c) => {
          s[c] = answer;
          return s
        }, {});
        item.score = answer == "correct" ? 1 : 0;
        }
        break;
      case 'connectTo':
        {
        let correctLinks = item.config.correctLinks ? item.config.correctLinks.map(x => referenceMap.links.find(y => y.id === x)) : [].concat(referenceMap.links.find(x => x.id == item.config.correctLink))
        item.scoreStyles = {};
        item.score = 0; 

        if(item.config.userLinks && item.config.userLinks.length > 0){
          let userLinks = item.config.userLinks.map(x => takerMap.links.find(y => y.id == x));

          Object.entries(item.styles)
            .filter(x => x[1] == "hidden")
            .forEach(([gid, style]) => {
              //item.scoreStyles[gid] = style;
            })

          //console.log("checking links...", correctLinks, userLinks)
          
          userLinks.forEach(u => {
            let correct = correctLinks.map(x => x.target).includes(u.target.id);
            let answer =  correct  ? "correct" : "incorrect";
            item.score += correct ? 1 : 0;
            item.scoreStyles[u.id] = answer;
          })

          correctLinks.forEach(c => {
            let included = userLinks.map(x => (x.source).id).includes(c.source);
            if(!included){
              item.score -= included ? 0 : 1/correctLinks.length;
              let targetNodeId = getNodeId(c.target)
              item.scoreStyles[targetNodeId] = "missing";
            }
          })

          item.score = item.score >= 0 ? item.score : 0;
        }
        else{
          // add a new link for each correct link
          //console.log("old scores", item.id, correctLink)
          
          item.scoreStyles = {};
          item.score = 0
        }
      }
      break;

      case 'dragDrop':
      {
        let correctLinkObjs = item.config.correctLinkObjs
        //let correctLinks = item.config.correctLinks ? item.config.correctLinks.map(x => referenceMap.links.find(y => y.id === x)) : [].concat(referenceMap.links.find(x => x.id == item.config.correctLink))
        item.scoreStyles = {};
        item.score = 0; 
        item.config.userLinks = item.config.userLinks || [];
        if(item.config.userLinks && item.config.userLinks.length > 0){
          let userLinks = item.config.userLinks.map(x => takerMap.links.find(y => y.id == x));

          console.log(userLinks);

          if(userLinks.length > 0){
            userLinks.forEach(userLink => {
              //console.log("user link...", u.source.id, correctLinks)
              let correct = correctLinkObjs.find(correctLink => correctLink.source === SeroUtil.getNodeId(userLink.source) && correctLink.target === SeroUtil.getNodeId(userLink.target))
              /*let correct = correctLinks.find(x => {
                let co = referenceMap.nodes.find(z => z.id == x.target);
                let uo = takerMap.nodes.find(z => z.id == u.target.id);
                return co.value === uo.value && x.source === u.source.id
              })*/
              let answer = correct ? "correct" : "incorrect";
              let targetNodeId = SeroUtil.getNodeId(userLink.target);

              item.score += correct ? 1 : 0;
              item.scoreStyles[userLink.id] = answer;
              item.scoreStyles[targetNodeId] = answer;
            })
          }         

          correctLinkObjs.forEach(correctLink => {

            let included = userLinks.find(userLink => correctLink.source === SeroUtil.getNodeId(userLink.source) && correctLink.target === SeroUtil.getNodeId(userLink.target));

            //console.log("correct", correctLink, included)          

            if(!included){
              let missingLink = {
                id: SeroUtil.getGraphId(),
                type: "target",
                source: correctLink.source,
                target: correctLink.target
              }
              takerMap.links.push(missingLink)

              item.score -= included ? 0 : 1/correctLinkObjs.length;
              let targetNodeId = SeroUtil.getNodeId(correctLink.target);
              item.scoreStyles[targetNodeId] = "incorrect";
              item.scoreStyles[missingLink.id] = "missing"
            }
          })

        }
        else {
          correctLinkObjs.forEach(correctLink => {
            let missingLink = {
              id: SeroUtil.getGraphId(),
              type: "target",
              source: correctLink.source,
              target: correctLink.target
            }
            takerMap.links.push(missingLink)

            //update d&d bank node position
            let sn = takerMap.nodes.find(n => n.id === missingLink.source);
            let tn = takerMap.nodes.find(n => n.id === missingLink.target);
            tn.x = sn.x
            tn.y = sn.y + 200

            item.score -= 1/correctLinkObjs.length;
            let targetNodeId = SeroUtil.getNodeId(correctLink.target);
            console.log("target node: ", targetNodeId, takerMap.bank);
            item.scoreStyles[targetNodeId] = "unanswered";
            item.scoreStyles[missingLink.id] = "missing"
          })
        }

        item.score = item.score < 0 ? 0 : item.score;

      }
      break
      case "arrowDirection":
      {
        item.scoreStyles = {}
        item.score = 0;
        //console.log(item)
        if(item.config.correctLink) item.config.correctLinks = [].concat(item.correctLink);
        let totalLinks = item.config.correctLinks.length;

        /*Object.keys(item.styles).forEach(x => {
          //item.scoreStyles[x] = "clear";
          if(!item.config.correctLinks.includes(x)) {
            takerMap.links.forEach(z => {
              if(z.id === x){
                let ts = z.source;
                z.source = z.target;
                z.target = ts;
                z.type = "source";
                console.log("reversed AD", item)
              }
            })
          }
        })*/

        if(item.config.userLinks){
          item.config.userLinks.forEach(x => {
            let correct = item.config.correctLinks.includes(x);
            item.scoreStyles[x] = correct ? "correct" : "incorrect";
            item.score = correct ? 1 : 0;
            if(correct){
              // remove the arrowhead from incorrect link
              let otherLinkId = Object.keys(item.styles).find(z => z !== x);
              let otherLink = takerMap.links.find(z => z.id === otherLinkId);
              let ts = otherLink.source;
              otherLink.source = otherLink.target;
              otherLink.target = ts;
              otherLink.type = "source";
              item.scoreStyles[otherLinkId] = "correct"
              console.log("reversed AD")
            }
          })
          item.config.correctLinks.forEach(x => {
            let excluded = !item.config.userLinks.includes(x);
            item.scoreStyles[x] = item.scoreStyles[x] || "missing";
            item.score = excluded ? 0 : item.score;
          })
        }
        else {
          item.config.correctLinks.forEach(x => {
            item.scoreStyles[x] = "missing";
          })
        }
      }
      break

      default:
      break;
    }
  }

  function checkFillIn(correctAnswer, userAnswer, altAnswer) {
    console.log("check fill in", correctAnswer, userAnswer, altAnswer)
    let result = 'incorrect';
    if(correctAnswer.toLowerCase() == userAnswer.toLowerCase()) result = 'correct';
    else {
      altAnswer.forEach(ans => {
        if(ans.toLowerCase() == userAnswer.toLowerCase()) result = 'correct';
      });
    }
    // return correctAnswer.toLowerCase() == userAnswer.toLowerCase() ? 'correct' : 'incorrect';
    return result
  }

  function checkMultiChoice(correctAnswer, userAnswer) {
    return correctAnswer == userAnswer ? 'correct' : 'incorrect';
  }

  function checkErrorDetection(correctAnswer, userAnswer) {
    return correctAnswer == userAnswer ? 'correct' : 'incorrect';
  }

  function checkDragDrop(correctLinks, userLinks) {
  }
