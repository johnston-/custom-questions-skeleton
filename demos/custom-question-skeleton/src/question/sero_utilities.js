// GRAPH UTILITIES

  export function chunkNodeText(node, ct) {

    let textValue = node.displayValue || node.value
    //let textNode = dom
    let maxWidth = 100

    let checkText = ct
    let chunks = textValue.split(/\s/).filter(x => x.length > 0)
    let measuredChunks = chunks.map(x => {
      checkText.innerHTML = x
      let textWidth = checkText.getComputedTextLength()
      return [x, textWidth]
    })

    let formattedChunks = measuredChunks.reduce((s,c,i) => {
      let cValue = c[0]
      let cWidth = c[1]
      let lastRow = [...s].pop()
      
      if(lastRow.width + cWidth > maxWidth) {
        s.push({width: cWidth, chunks: [cValue], yPosition: undefined})
      } else {
        s[s.length-1].width += cWidth
        s[s.length-1].chunks.push(cValue)
      }
      return s
    }, [{width: 0, chunks: [], yPosition: undefined}])

    return formattedChunks
      .filter(x => x.chunks.length > 0)
      .map((x,i) => {
        x.yPosition = i == 0 ? 4 : 18;
        return x
      });
  }

  export function getCompassPoint(targetNode, px, py){
    // return the point on the targetNode that is closest to the source (x,y)
    // N, NE, E, SE, S, SW, W, NW
    px = px || 0;
    py = py || 0;



    let compassPoints = [
      {dir: "N", x: targetNode.x, y: targetNode.y - (targetNode.height / 2) - py},
      {dir: "NE", x: targetNode.x + (targetNode.width / 2) + px, y: targetNode.y - (targetNode.height / 2) - py},
      {dir: "E", x: targetNode.x + (targetNode.width / 2) + px, y: targetNode.y},
      {dir: "SE", x: targetNode.x + (targetNode.width / 2) + px, y: targetNode.y + (targetNode.height / 2) + py},
      {dir: "S", x: targetNode.x, y: targetNode.y + (targetNode.height / 2) + py + 4},
      {dir: "NW", x: targetNode.x - (targetNode.width / 2) - px, y: targetNode.y - (targetNode.height / 2) - py},
      {dir: "W", x: targetNode.x - (targetNode.width / 2) - px, y: targetNode.y},
      {dir: "SW", x: targetNode.x - (targetNode.width / 2) - px, y: targetNode.y + (targetNode.height / 2) + py}
    ];

    return (sourceNode) => {
      // if source y > target y by ___ always use north
      if(sourceNode.y < targetNode.y && targetNode.y - sourceNode.y > 10) return {dir: "N", x: targetNode.x, y: targetNode.y - (targetNode.height / 2) - py};
      return compassPoints.sort((a,b) => getDistance(sourceNode.x, sourceNode.y, a.x, a.y) > getDistance(sourceNode.x, sourceNode.y, b.x, b.y) ? 1 : -1).shift()
    }

  }

  export function getCompassPointFlat(targetNode, px, py){
    // return the closest cardinal direction on targetNode that is closest to the source (x,y)
    // N, E, S, W
    px = px || 0;
    py = py || 0;

    let compassPoints = [
      {dir: "N", x: targetNode.x, y: targetNode.y - (targetNode.height / 2) - py},
      {dir: "E", x: targetNode.x + (targetNode.width / 2) + px, y: targetNode.y},
      {dir: "S", x: targetNode.x, y: targetNode.y + (targetNode.height / 2) + py + 4},
      {dir: "W", x: targetNode.x - (targetNode.width / 2) - px, y: targetNode.y},
    ];

    return (sourceNode) => {
      return compassPoints.sort((a,b) => getDistance(sourceNode.x, sourceNode.y, a.x, a.y) > getDistance(sourceNode.x, sourceNode.y, b.x, b.y) ? 1 : -1).shift()
    }

  }

  export function chunkFormattedText(lineBreaks, node, ct) {
    const maxWidth = 100
    let checkText = ct

    return lineBreaks.map(chunks => {
      checkText.innerHTML = chunks.join(" ")
      let textWidth = checkText.getComputedTextLength()
      return {chunks: chunks, width: textWidth}
    })

  }

  export function getCompassPointDirection(targetNode, direction){
    // return the point on the targetNode in a particular direction
    // N, NE, E, SE, S, SW, W, NW
    let x = null;
    let y = null;

    if(direction === "N"){
      x = targetNode.x;
      y = targetNode.y - (targetNode.height / 2);
    }
    else if(direction === "NE"){
      x = targetNode.x + (targetNode.width / 2);
      y = targetNode.y - (targetNode.height / 2);
    }
    else if(direction === "E"){
      x = targetNode.x + (targetNode.width / 2);
      y = targetNode.y;
    }
    else if(direction === "SE"){
      x = targetNode.x + (targetNode.width / 2);
      y = targetNode.y + (targetNode.height / 2);
    }
    else if(direction === "S"){
      x = targetNode.x;
      y = targetNode.y + (targetNode.height / 2) + 4;
    }
    else if(direction === "NW"){
      x = targetNode.x - (targetNode.width / 2);
      y = targetNode.y - (targetNode.height / 2);
    }
    else if(direction === "W"){
      x = targetNode.x - (targetNode.width / 2);
      y = targetNode.y;
    }
    else if(direction === "SW"){
      x = targetNode.x - (targetNode.width / 2);
      y = targetNode.y + (targetNode.height / 2);
    }

    return {"x": x, "y": y};

  }

  export function cleanAssessmentMap(taker_map) {
    // format all links
    //taker_map.links = taker_map.links.map(x => {x.source = x.source.id; x.target = x.target.id; return x });

    //remove all connect-to selectors + links
    //remove all links to connect-to selectors

    let connectNodes = taker_map.nodes.filter(x => x.assessmentItem && x.assessmentItem == "connect-to");
    taker_map.links = taker_map.links.filter(x => !connectNodes.map(z => z.id).includes(x.target.id));
    taker_map.nodes = taker_map.nodes.filter(x => !connectNodes.map(z => z.id).includes(x.id));
    //remove all icons
    taker_map.nodes = taker_map.nodes.map(x => { delete x.icon; return x })
    return taker_map;
  }

  export function formatReusableBAMTakerMap(takerMap) {
    let rawTripleValues = takerMap.settings.rawTriples.map(x => typeof x === "object" ? x.value : x)

    takerMap.links.forEach(x => { delete x.style })

    let correctTriples = takerMap.triples.filter(x => rawTripleValues.find(z => z.join() === x.value.join()))
    let incorrectTriples = takerMap.triples.filter(x => !rawTripleValues.find(z => z.join() === x.value.join()))
    let missingTriples = rawTripleValues.filter(x => !correctTriples.find(z => z.value.join() === x.join()))

    correctTriples.forEach(t => {
      let tl = takerMap.links.find(x => x.id === t.config.targetId)
      tl.style = "correct";
    })

    incorrectTriples.forEach(t => {
      let tl = takerMap.links.find(x => x.id === t.config.targetId)
      tl.style = "incorrect";
    })

    if(missingTriples.length > 0){
      missingTriples.forEach(mt => {
        // find S->R or create new LP with xy average of sub and obj
        let existingSourceLink = takerMap.links.find(tl => {
          //console.log(tl, takerMap.nodes.map(z => z.id))
          let sn = takerMap.nodes.find(x => x.id === getNodeId(tl.source))
          let tn = takerMap.nodes.find(x => x.id === getNodeId(tl.target))
          return  sn.value === mt[0] && tn.value === mt[1]
        })
        let existingTarget = takerMap.nodes.find(x => x.value === mt[2])


        let nLP = undefined;
        
        if(!existingSourceLink){
          // create source link

          let existingSubject = takerMap.nodes.find(x => x.value === mt[0])

          nLP = {
            id: getGraphId(),
            type: "relation",
            x: existingSubject.x ? existingSubject.x : undefined,
            y: existingSubject.y ? existingSubject.y + 50 : undefined,
            value: mt[1],
            style: "missing",
            missing_style: "missing"
          }

          existingSourceLink = {
            id: getGraphId(),
            type: "source",
            source: existingSubject.id,
            target: nLP.id,
            style: "missing",
            missing_style: "missing"
          }
          takerMap.nodes.push(nLP)
          takerMap.links.push(existingSourceLink)
        }
        if(!existingTarget){
          existingTarget = {
            id: getGraphId(),
            type: "concept",
            value: mt[2],
            style: "missing",
            missing_style: "missing"
          };
          takerMap.nodes.push(existingTarget)
        }

        // create target link
        let nTargetLink = {
          id: getGraphId(),
          source: existingSourceLink ? getNodeId(existingSourceLink.target) : nLP.id,
          target: existingTarget.id,
          type: "target",
          style: "missing",
          missing_style: "missing"
        }
        takerMap.links.push(nTargetLink)
      })      
    }
  }

  export function getMissingTripleLinks(assessment, takerMap) {
    if(assessment.type === "skeleton-map"){
      return getMissingSKELinks(assessment, takerMap)
    }
    else if(assessment.type === "build-map"){
      let missingTriples = assessment.triples.filter(x => !takerMap.triples.map(y => y.value.join()).includes(x.value.join()))
      return missingTriples.reduce((s,c) => {
        //add source and target links for each triple, no duplciates
        if(!s.find(y => y.id === c.config.sourceId)) s.push(c.config.sourceId);
        if(!s.find(y => y.id === c.config.targetId)) s.push(c.config.targetId);
        return s
      }, [])
      .map(x => {
        let link = assessment.links.find(y => y.id == x);
        link.style = "missing";
        link.missing_style = "missing";
        return link
      })
    }    
  }

  function getMissingSKELinks(assessment, takerMap) {
    let resultMissing = [];

    takerMap.items.forEach(item => {
      if(item.type == "connectTo"){
        let correctLinks = item.config.correctLinks ? item.config.correctLinks.map(x => assessment.links.find(y => y.id === x)) : [].concat(assessment.links.find(x => x.id == item.config.correctLink))
        let userLinks = [];
        if(item.config.userLinks && item.config.userLinks.length > 0){
          userLinks = item.config.userLinks.map(x => takerMap.links.find(y => y.id == x));
        }
        else userLinks = [];

        correctLinks.forEach(c => {
          let isPresent = userLinks.find(uLink => (getNodeId(uLink.source) == getNodeId(c.source)) && (getNodeId(uLink.target) == getNodeId(c.target)));
          if(!isPresent){
            let correctObj = assessment.links.find(x => x.id === c.id);
            let miss = {...correctObj}
            miss.style = "missing";
            miss.missing_style = "missing";
            resultMissing.push(miss);
          }
        })
      }
    })
  
    let linkItems = assessment.items.filter(x => ['connectTo', 'dragDrop'].includes(x.type));
    linkItems.forEach(item => {
      item.config.correctLinks.forEach(correct => {
        let correctObj = assessment.links.find(x => x.id === correct)
        let notMissing = takerMap.links.find(x => getNodeId(x.source) == getNodeId(correctObj.source) && getNodeId(x.target) == getNodeId(correctObj.target))
        if(!notMissing){
          // if not add as missing
          let miss = {...correctObj}
          miss.style = "missing";
          miss.missing_style = "missing"
          resultMissing.push(miss)
        }
      })
    })
    return resultMissing
  }

  export function getUniqueId(allId, type){
    let argType = type ? type : null;
    let id = getGraphId(argType);
    while(allId.includes(id)){
      id = getGraphId(argType);
    }
    return id
  }

  export function getGraphId(type) {
    let abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    let snip = new Date().getTime()+"";
    snip = snip.substring(snip.length - 6, snip.length - 1);
    let first = (+snip.substring(2,5)) + Math.floor(Math.random()*400);
    let last = (+snip.substring(0,2)) + Math.floor(Math.random()*40);
    let ii = (+first) % 26;
    let jj = (+last) % 13;
    let lLetter = type || abc[jj];
    let rLetter = abc[ii];
    return lLetter+first+"-"+rLetter+last;
  }

  export function getNodeId(n){
    return typeof n == "string" ? n : n.id;
  }

  export function compare(a, b, isAsc) {
    a = typeof a === "string" ? a.toLowerCase() : a;
    b = typeof b === "string" ? b.toLowerCase() : b;
    let order = (a < b ? -1 : 1) * (isAsc ? 1 : -1)
    //console.log(a,b,order)
    return order;
  }

  export function getDistance (x1,y1,x2,y2){ return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))); };
  export function getMidpoint (x1,y1,x2,y2){ return [(x1+x2)/2,(y1+y2)/2]; };
    var get75Point = function(x1,y1,x2,y2){ var mid = getMidpoint(x1, y1, x2, y2); var mid2 = getMidpoint(mid[0], mid[1], x2, y2); return [x1, y1, mid2[0], mid2[1]]; };
    var get87Point = function(x1,y1,x2,y2){var mid = getMidpoint(x1, y1, x2, y2); var mid2 = getMidpoint(mid[0], mid[1], x2, y2); var mid3 = getMidpoint(mid2[0], mid2[1], x2, y2); return [x1, y1, mid3[0], mid3[1]];};
    var getSlopeFromCoorArray = function(coors){ return (coors[3] - coors[1]) / (coors[2] - coors[0]); };
    function getSlope(source, target) { return (source.y - target.y) / (source.x - target.x) }
    var getOffset = function(x1,x2){return ((x2-x1) > 0) ? -90 : 90;};
    var convSlopeToRad = function(slope){ return Math.atan(slope); };
    var convRadToDegrees = function(rad, offset){ return (rad * 360) / (Math.PI * 2) + offset; };
  //export function formatRotation(source, target){ return convRadToDegrees(convSlopeToRad(getSlopeFromCoorArray(get87Point(source.x, source.y, target.x, target.y))), getOffset(target.x, source.x));};
  export function formatRotation(source, target){ 
    let slope = getSlope(source, target)
    let rad = convSlopeToRad(slope)
    let off = getOffset(source.x, target.x)
    return convRadToDegrees(rad, off) + 180
  };
  //let formatRotationCompass = function(source, target){ return convRadToDegrees(convSlopeToRad(getSlopeFromCoorArray([source.x, source.y, findClosestCompassPoint(source, target).x, findClosestCompassPoint(source, target).y])), getOffset(target.x, source.x));};

  export function getPentagonCoors(cx, cy, len){
    var length = len || 16;

    var half_length = length / 2,
    side_length = length * (1/6),
    x1 = cx - half_length,
    y1 = cy - half_length / 2,
    x2 = cx + half_length,
    y2 = cy - half_length / 2;

    return "M".concat((x1+half_length)+" ").concat(y1+" ") //starting point top middle
    .concat("L"+x1+" ").concat((y1 + half_length - side_length) +" ") //left side
    .concat("V"+(y1 + half_length)+" ") // side length
    .concat("H"+x2+" ")
    .concat("V"+(y1 + half_length - side_length)+" Z");
  }
    
  export function findList(x, y, nodes, radius){

    var i = 0,
      n = nodes.length,
      dx,dy,d2,node,
      closest = []

    if (!radius){ radius = Infinity; }
    else{ radius *= radius; }

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      dx = x - node.x;
      dy = y - node.y;
      d2 = dx * dx + dy * dy;
      if (d2 < radius){ 
        closest.push(node);
      }
    }
    return closest
  }

  export function findNodesInRect(nodes, x1, y1, x2, y2){
    return nodes.filter(n => n.x >= x1 && n.y >= y1 && n.x <= x2 && n.y <= y2)
  }

  export function arrangeNodesInRows(dimensions, pad, nodes) {
    //console.log(dimensions)
    let [cw, ch] = dimensions
    let [px, py] = pad || [20, 20] //pad
    let [sx, sy] = [0, 0]
    let rows = [[]]

    //console.log(dimensions, pad)
    //nodes.sort((a,b) => a.height - b.height)
    nodes.forEach(n => {
      let w = n.width || 100;
      let h = n.height || 40;
      //console.log(n.value, w, h)
      
      if(sx + px + w + px < cw){
        sx = sx + px + w/2;
        n.fx = n.x = sx;
        sx += w/2
      }
      else{        
        sy = sy + h + py;
        sx = w/2;
        n.fx = n.x = sx;
        sx += w/2;
      }

      
      n.fy = n.y = sy;
      
      //console.log(n.value, n.fx, n.fy)
    })
    //return [sx, sy]
    return [sx, -33]
  }

  function setNodeDepth(G, depth, sourceNodes) {
    //sourcelist is a lit of nodes
    if(sourceNodes.length){
      var result = [];
      sourceNodes.forEach(d => {
        if(!d.depth){
          d.depth = depth;
          var children = G.links.filter(x => x.source == d.id).map(x => G.nodes.find(y => y.id === x.target));        
          result = result.concat(children).reduce((s,c) => {
            if(!s.find(x => x.id === c.id)){ s.push(c); }
            return s;
          }, []);   
        }
      });
      console.log("depth", depth, result)
      setNodeDepth(G, depth+1, result);
    }
  }

  function getRootNodes(G) {
    return G.nodes.filter(n => !G.links.map(x => x.target).includes(n.id))
  }

  export function setGraphDepth(G){
    if(getRootNodes(G).length > 0){
      setNodeDepth(G, 0, getRootNodes(G))
      let maxDepth = G.nodes.reduce((s,c) => s.depth > c.depth ? s : c).depth;
      let tallestForDepthLevel = new Array(maxDepth)
      for(let i=0; i <= maxDepth; i+=1){
        tallestForDepthLevel[i] = G.nodes.filter(x => x.depth === i).reduce((s,c) => s.height > c.height ? s : c).height;
      }
      G.nodes.forEach(n => {
        let buffer = tallestForDepthLevel.slice(0, n.depth).length > 0 ? tallestForDepthLevel.slice(0, n.depth).reduce((a,b) => a + b) : 0
        n.y = (n.depth * 20) + buffer;
        n.fy = n.y;
      })
    }
  }

// SERO DATA
  function getExtents(selection) {
    let maxX = selection.reduce((a,x) => { return Math.max(x.x, a) }, -Infinity)
    let minX = selection.reduce((a,x) => { return Math.min(x.x, a) }, Infinity)
    let maxY = selection.reduce((a,x) => { return Math.max(x.y, a) }, -Infinity)
    let minY = selection.reduce((a,x) => { return Math.min(x.y, a) }, Infinity)
    let extentX = Math.abs(maxX - minX)
    let extentY = Math.abs(maxY - minY)
    return {width: extentX, height: extentY}
  }

  export function convertCXLToSero(rawString) {
    let formattedString = rawString.replace(/(&#xa;)/g, " ");
    var xmlDoc = new DOMParser().parseFromString(formattedString, "application/xml");

    var conceptAppearance = [].map.call(xmlDoc.querySelectorAll("concept-appearance"), function(d){
      return {
        id: d.getAttribute('id'),
        type: "concept",
        x: d.getAttribute('x'),
        y: d.getAttribute('y')
      };
    }).reduce(function(s,c){
      s[c.id] = c;
      return s;
    }, {});

    var appearanceMap = [].map.call(xmlDoc.querySelectorAll("linking-phrase-appearance"), function(d){
      return {
        id: d.getAttribute('id'),
        type: "relation",
        x: d.getAttribute('x'),
        y: d.getAttribute('y')
      };
    }).reduce(function(s,c){
      s[c.id] = c;
      return s;
    }, conceptAppearance);

    var concepts = [].map.call(xmlDoc.querySelectorAll("concept"), function(d) {
      var tid = d.getAttribute("id");
      return {
        type: "concept",
        id: tid,
        value: d.getAttribute("label"),
        x: +appearanceMap[tid].x,
        y: +appearanceMap[tid].y
      };
    });

    var relations = [].map.call(xmlDoc.querySelectorAll("linking-phrase"), function(d) {
      var tid = d.getAttribute("id");
      return {
        type: "relation",
        id: tid,
        value: d.getAttribute("label"),
        x: +appearanceMap[tid].x,
        y: +appearanceMap[tid].y
      };          
    });

    var links = [].map.call(xmlDoc.querySelectorAll("connection"), function(d) {
      let sourceId = d.getAttribute("from-id")
      let type = concepts.find(x => x.id == sourceId) ? "source" : "target";
      return {
        type: type,            
        id: d.getAttribute("id"),
        source: sourceId,
        target: d.getAttribute("to-id")
      };          
    });

    var nodes = concepts.concat(relations).map(x => {x.fx = x.x; x.fy = x.y; return x });

    let conceptIds = nodes.filter(x => x.type == "object").map(x => x.id);
    let relationIds = nodes.filter(x => x.type == "relation").map(x => x.id);

    let sourceLinks = links.filter(x => x.type == "source");
    let targetLinks = links.filter(x => x.type == "target");

    //add triple config
    let triples = []
          
    sourceLinks.forEach(sourceLink => {
      let sub = nodes.find(x => x.id == sourceLink.source);
      let rel = nodes.find(x => x.id == sourceLink.target);
      targetLinks.filter(c => c.source === sourceLink.target)
      .forEach(targetLink => {
        let obj = nodes.find(x => x.id == targetLink.target);
        let allLinkId = links.map(link => link.id).concat(nodes.map(node => node.id));
        let id = getUniqueId(allLinkId, "t");
          let temp = {
            id: id,
            value: [sub.value, rel.value, obj.value],
            config: {
              subId: sub.id,
              relId: rel.id,
              objId: obj.id,
              sourceId: sourceLink.id,
              targetId: targetLink.id,
              fork: targetLinks.filter(x => x.source === rel.id).length > 1,
              join: sourceLinks.filter(x => x.target === rel.id).length > 1
            }
          }

        triples.push(temp);
      });
            
    });

    return {nodes: nodes, links: links, triples: triples, type: "cmap"};
  }

  export function convertSeroJsonToCXL(assignmentObj, userObj) {
    let assessmentObj = assignmentObj.assessment;
    let resMeta = "<res-meta>" +
      `<dc:title>${assessmentObj.name}</dc:title>` +
      `<dc:creator><vcard:FN>${userObj.name}</vcard:FN><vcard:EMAIL>${userObj.email}</vcard:EMAIL></dc:creator>` +
      `<dc:contributor><vcard:FN>${userObj.name}</vcard:FN><vcard:EMAIL>${userObj.email}</vcard:EMAIL></dc:contributor>` +
      `<dcterms:rightsHolder><vcard:FN>${userObj.name}</vcard:FN><vcard:EMAIL>${userObj.email}</vcard:EMAIL></dcterms:rightsHolder>` +
      `<dcterms:created>${assignmentObj.created_date}</dcterms:created>` + 
      `<dcterms:modified>${assignmentObj.updated_date}</dcterms:modified>` + 
      "<dc:language>en</dc:language><dc:format>x-cmap/x-storable</dc:format><dc:publisher>FIHMC CmapTools 6.03</dc:publisher><dc:extent>12563 bytes</dc:extent><dc:source>cmap:1194657966095_162439605_0:1W046GN0G-1QZY2C5-8NZ:1W046H2WG-1CRQ8L1-JJK</dc:source>" +
      "</res-meta>"
    
    let mapSize = getExtents(assessmentObj.nodes)
    let map = `<map width="${mapSize.width}" height="${mapSize.height}">`
    let conceptList = assessmentObj.nodes.filter(n => n.type === "concept").map(x => `<concept id="${x.id}" label="${x.value}" />`).join("\n")
    let lpList = assessmentObj.nodes.filter(n => n.type === "relation").map(x => `<linking-phrase id="${x.id}" label="${x.value}" />`).join("\n")
    let connectionList = assessmentObj.links.map(x => `<connection id="${x.id}" from-id="${x.source}" to-id="${x.target}" />`)
    let conceptAppearanceList = assessmentObj.nodes.filter(n => n.type === "concept").map(x => `<concept-appearance id="${x.id}" x="${x.x}" y="${x.y}" width="${x.width}" height="${x.height}" />`).join("\n")
    let lpAppearanceList = assessmentObj.nodes.filter(n => n.type === "relation").map(x => `<linking-phrase-appearance id="${x.id}" x="${x.x}" y="${x.y}" width="${x.width}" height="${x.height}" />`).join("\n")
    let connectionAppearanceList = assessmentObj.links.map(x => `<connection id="${x.id}" from-pos="center" to-pos="center" arrowhead="if-to-concept" />`)

    map = map + "<concept-list>" + conceptList + "</concept-list>" +
      "<linking-phrase-list>" + lpList + "</linking-phrase-list>" +
      "<connection-list>" + connectionList + "</connection-list>" +
      "<concept-appearance-list>" + conceptAppearanceList + "</concept-appearance-list>" +
      "<linking-phrase-appearance-list>" + lpAppearanceList + "</linking-phrase-appearance-list>" +
      "<connection-appearance-list>" + connectionAppearanceList + "</connection-appearance-list>" +
      styleSheetList +
      extraGraphicalList +
      "</map>"

    let cmap = '<?xml version="1.0" encoding="UTF-8"?><cmap xmlns:dcterms="http://purl.org/dc/terms/" xmlns="http://cmap.ihmc.us/xml/cmap/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">' +
      resMeta +
      map +
      "</cmap>"

    return cmap
  }

  let styleSheetList = '<style-sheet id="_Default_"><map-style background-color="255,255,255,0" image-style="full" image-top-left="0,0"/><concept-style font-name="Verdana" font-size="12" font-style="plain" font-color="0,0,0,255" text-margin="4" background-color="237,244,246,255" background-image-style="full" border-color="0,0,0,255" border-style="solid" border-thickness="1" border-shape="rounded-rectangle" border-shape-rrarc="15.0" text-alignment="center" shadow-color="none" min-width="-1" min-height="-1" max-width="-1.0" group-child-spacing="10" group-parent-spacing="10"/><linking-phrase-style font-name="Verdana" font-size="12" font-style="plain" font-color="0,0,0,255" text-margin="1" background-color="0,0,255,0" background-image-style="full" border-color="0,0,0,0" border-style="solid" border-thickness="1" border-shape="rectangle" border-shape-rrarc="15.0" text-alignment="center" shadow-color="none" min-width="-1" min-height="-1" max-width="-1.0" group-child-spacing="10" group-parent-spacing="10"/><connection-style color="0,0,0,255" style="solid" thickness="1" type="straight" arrowhead="if-to-concept-and-slopes-up"/><resource-style font-name="SanSerif" font-size="12" font-style="plain" font-color="0,0,0,255" background-color="192,192,192,255"/></style-sheet>'
  let extraGraphicalList = ""



// STYLE

  function styleScoredTakerMap(assessmentItems, nodes, links) {
    // for each assessment item that has been scored
    // style the associated nodes and links
    // add d.style to each node and link

  }

  function styleScoredMasterMap(){}

  function styleCompositeMap(masterMap, compositeMap, filters, spacing) {
    // spacing = multiplier to use for node positioning
    // filters = list of available types
    compositeMap.triples.forEach(trip => {
      //...
    });

    compositeMap.nodes.forEach(x => {
      let c = masterMap.nodes.find(y => y.value == x.value);
      x.x = c.x * spacing;
      x.fx = c.x * spacing;
      x.y = c.y * spacing;
      x.fy = c.y * spacing;
      
      let gma = compositeMap.links.filter(y => getLinkId(y.source) === x.id || getLinkId(y.target) === x.id).map(y => y.style);      
      let isHidden = gma.filter(y => y !== "none").length == 0;
      x.style = isHidden ? "none" : x.style;
    });    
  }

// UTILITIES

  export function getLinkId(source) {
    return typeof source === "string" ? source : source.id;
  }

  export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

// FORMATTING

  export function getMillisFromSessions(stack) {
    let a = stack[0].start_date
    let b = stack[stack.length-1].end_date
    return +new Date(b) - +new Date(a)    
  }
  
  export function getDurationString(millis){
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (+seconds < 10 ? '0' : '') + seconds;
  }

  export function getCalendarString(date) {
    // 2020-08-18
    let parts = Intl.DateTimeFormat().formatToParts(new Date(date));
    let month = parts.find(x => x.type == "month") ? parts.find(x => x.type == "month").value.length == 1 ? "0"+parts.find(x => x.type == "month").value : parts.find(x => x.type == "month").value : "";
    let day = parts.find(x => x.type == "day") ? parts.find(x => x.type == "day").value.length == 1 ? "0"+parts.find(x => x.type == "day").value : parts.find(x => x.type == "day").value : "";
    let year = parts.find(x => x.type == "year").value
    let result = `${year}-${month}-${day}`;
    return result
  }

  export function getShortDateString(date) {
    let newDate = new Date(date)
    let formDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000)
    
    return Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(formDate));
  }

  export function getLongDateString(date) {
    let newDate = new Date(date)
    //let timeOffset = newDate.getTimezoneOffset() * 60000;    
    //let formDate = new Date(newDate.getTime() + timeOffset);
    let formDate = new Date(newDate.getTime());
    return Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  export function getYYYYMMDD(date) {
    let d = date ? new Date(date) : new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}