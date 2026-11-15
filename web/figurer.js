const standing = {
  torso:[[64,38],[62,74]], legs:[[[62,74],[65,103],[65,126]],[[62,74],[58,103],[57,126]]],
  arms:[[[64,39],[71,61],[71,78]],[[64,39],[58,60],[56,77]]]
};
const seated = {
  torso:[[64,40],[65,77]], legs:[[[65,77],[94,78],[95,123]],[[65,77],[88,79],[89,123]]],
  arms:[[[64,41],[69,61],[76,78]],[[64,41],[59,62],[65,79]]],
  seat:true
};
const floor = {
  torso:[[44,99],[77,108]], legs:[[[77,108],[102,87],[120,119]],[[77,108],[97,89],[115,119]]],
  arms:[[[44,99],[59,112],[78,112]]]
};
const squat = {
  ...standing, torso:[[62,61],[54,94]], legs:[[[54,94],[80,101],[67,126]],[[54,94],[75,102],[62,126]]],
  arms:[[[62,61],[77,66],[94,68]],[[62,61],[72,66],[89,68]]]
};
const hinge = {
  torso:[[88,58],[56,75]], legs:[[[56,75],[67,102],[66,126]],[[56,75],[62,102],[60,126]]],
  arms:[[[88,58],[80,83],[76,108]],[[88,58],[75,82],[71,107]]]
};
const barDeadlift = {
  ...hinge, torso:[[88,74],[52,91]], legs:[[[52,91],[72,103],[66,126]],[[52,91],[66,103],[60,126]]],
  arms:[[[88,74],[79,98],[74,118]],[[88,74],[74,97],[69,117]]]
};
const elbowStart = {...seated, arms:[[[64,41],[67,64],[68,89]]], active:"arms"};
const elbowEnd = {...elbowStart, arms:[[[64,41],[67,64],[79,46]]]};
const floorPressStart = {...floor, arms:[[[44,99],[56,111],[59,93]]], active:"arms"};
const floorPressEnd = {...floorPressStart, arms:[[[44,99],[47,78],[49,57]]]};
const pressStart = {...seated, arms:[[[64,41],[79,52],[79,35]],[[64,41],[51,52],[51,35]]], active:"arms"};
const pressEnd = {...pressStart, arms:[[[64,41],[76,25],[79,8]],[[64,41],[53,24],[51,8]]]};
const squatWithRack = pose => {
  const [x,y] = pose.torso[0];
  return {...pose, arms:[[[x,y],[x+15,y+8],[x+8,y-4]],[[x,y],[x+11,y+8],[x+5,y-4]]]};
};

const diagrams = {
  knee: [
    {...seated, active:"legs"},
    {...seated, legs:[[[65,77],[94,78],[127,77]],seated.legs[1]], active:"legs"}
  ],
  elbow: [elbowStart, elbowEnd],
  squat: [standing, squat],
  chairStand: [{...squat, seat:true}, standing],
  goblet: [squatWithRack(standing), squatWithRack(squat)],
  squatWeight: [
    {...standing, gear:"dumbbell"},
    {...squat, arms:[[[62,61],[65,82],[65,106]],[[62,61],[60,82],[60,106]]], gear:"dumbbell"}
  ],
  floorPress: [floorPressStart,floorPressEnd],
  press: [pressStart,pressEnd],
  hinge: [standing, hinge],
  barDeadlift: [barDeadlift,standing],
  kettlebellDeadlift: [barDeadlift,standing],
  frontSquat: [squatWithRack(standing),squatWithRack(squat)],
  backSquat: [standing,squat].map(pose => {
    const [x,y] = pose.torso[0];
    return {...pose, arms:[[[x,y],[x-8,y+14],[x-5,y-2]]], gear:"barbell"};
  }),
  pushUp: [
    {torso:[[46,61],[79,79]],legs:[[[79,79],[101,98],[126,122]]],arms:[[[46,61],[49,89],[50,122]]]},
    {torso:[[46,95],[79,103]],legs:[[[79,103],[103,112],[126,122]]],arms:[[[46,95],[61,102],[50,122]]]}
  ],
  sideRaise: [
    {...seated, arms:[[[64,41],[53,63],[48,85]],[[64,41],[76,63],[81,85]]], active:"arms"},
    {...seated, arms:[[[64,41],[43,48],[24,54]],[[64,41],[85,48],[104,54]]], active:"arms"}
  ],
  frontRaise: [
    elbowStart,
    {...seated, arms:[[[64,41],[86,44],[108,50]]], active:"arms"}
  ],
  march: [
    {...seated, active:"legs"},
    {...seated, legs:[[[65,77],[95,66],[103,106]],seated.legs[1]], active:"legs"}
  ],
  heel: [
    {...seated, legs:[[[65,77],[94,78],[95,123],[111,123]]], active:"legs"},
    {...seated, legs:[[[65,77],[94,72],[96,111],[111,123]]], active:"legs"}
  ],
  toe: [
    {...seated, legs:[[[65,77],[94,78],[95,123],[111,123]]], active:"legs"},
    {...seated, legs:[[[65,77],[94,78],[95,123],[110,114]]], active:"legs"}
  ],
  bridge: [floor,{...floor, torso:[[44,99],[80,82]], legs:[[[80,82],[101,84],[120,119]],[[80,82],[97,87],[115,119]]]}],
  stepUp: [
    {...standing, torso:[[51,36],[49,73]], legs:[[[49,73],[78,83],[87,101]],[[49,73],[51,100],[49,126]]], step:true},
    {...standing, torso:[[87,13],[86,49]], legs:[[[86,49],[86,75],[87,101]],[[86,49],[94,74],[100,101]]], arms:[[[87,14],[93,35],[93,56]]], step:true}
  ],
  lunge: [
    standing,
    {...standing, torso:[[59,54],[58,88]], legs:[[[58,88],[82,95],[81,126]],[[58,88],[43,112],[25,122]]],
      arms:[[[59,54],[64,75],[64,94]],[[59,54],[54,74],[52,93]]]}
  ],
  reach: [
    elbowStart, {...elbowStart, arms:[[[64,41],[84,47],[106,49]]]}
  ],
  externalRotation: [
    {...seated, arms:[[[64,41],[53,67],[62,64]],[[64,41],[77,67],[68,64]]], active:"arms"},
    {...seated, arms:[[[64,41],[53,67],[35,62]],[[64,41],[77,67],[96,62]]], active:"arms"}
  ],
  scapula: [
    {...seated, arms:[[[64,41],[54,64],[58,83]],[[64,41],[75,64],[71,83]]], active:"arms"},
    {...seated, arms:[[[64,41],[54,63],[55,83]],[[64,41],[75,63],[75,83]]], active:"arms"}
  ],
  palmPress: [
    {...seated, arms:[[[64,41],[48,60],[60,67]],[[64,41],[82,60],[70,67]]], active:"arms"},
    {...seated, arms:[[[64,41],[48,60],[65,65]],[[64,41],[82,60],[65,65]]], active:"arms"}
  ],
  walk: [
    {...standing, legs:[[[62,74],[52,99],[42,126]],[[62,74],[75,99],[87,126]]],
      arms:[[[64,39],[58,60],[47,70]],[[64,39],[74,58],[83,66]]]},
    {...standing, legs:[[[62,74],[75,99],[87,126]],[[62,74],[55,99],[48,115]]],
      arms:[[[64,39],[74,58],[83,66]],[[64,39],[58,60],[47,70]]]}
  ],
  wallPush: [
    {...standing, torso:[[76,45],[63,79]], legs:[[[63,79],[56,103],[51,126]]],
      arms:[[[76,45],[94,53],[110,54]]], wall:true},
    {...standing, torso:[[93,45],[72,79]], legs:[[[72,79],[61,103],[51,126]]],
      arms:[[[93,45],[94,66],[110,54]]], wall:true}
  ],
  closeGripPress: [
    {...seated, arms:[[[64,41],[79,56],[77,43]]], active:"arms"},
    {...seated, arms:[[[64,41],[84,45],[105,49]]], active:"arms"}
  ]
};

const movementNames = {
  "Sittende knestrekk":"knee", "Albuebøy":"elbow", "Albuebøy uten vekt":"elbow", "Sittende albuebøy":"elbow",
  "Sittende hammercurl med manualer":"elbow", "Sittende lett bicepscurl":"elbow",
  "Sittende bicepscurl med lette manualer":"elbow", "Sittende bicepscurl med kettlebell":"elbow",
  "Knebøy til stol":"chairStand", "Sett deg og reis deg fra en stol":"chairStand",
  "Rolig knebøy med kroppsvekt":"squat", "Knebøy med kroppsvekt":"squat",
  "Knebøy med lette manualer langs siden":"squatWeight", "Goblet squat med kettlebell":"goblet",
  "Gulvpress med manualer":"floorPress", "Sittende skulderpress med manualer":"press",
  "Rumensk markløft med manualer":"hinge", "Markløft med stang":"barDeadlift",
  "Markløft med kettlebell":"kettlebellDeadlift", "Frontbøy med stang":"frontSquat",
  "Knebøy med stang på ryggen":"backSquat", "Armheving på gulv":"pushUp",
  "Sittende sidehev med lette manualer":"sideRaise", "Sittende fronthev med manualer":"frontRaise",
  "Sittende marsj":"march", "Sittende hælløft":"heel", "Sittende tåhev":"toe",
  "Seteløft":"bridge", "Oppsteg på lav kasse":"stepUp", "Bakoverutfall":"lunge",
  "Bakoverutfall med manualer":"lunge", "Sittende rekkeøvelse":"reach",
  "Sittende brystpress fram med kettlebell":"closeGripPress",
  "Sittende utadrotasjon":"externalRotation", "Sittende utadrotasjon uten vekt":"externalRotation",
  "Sittende skulderbladsklem":"scapula", "Rolige skulderbladbevegelser":"scapula",
  "Sittende håndflatepress":"palmPress", "Rolig gange på flatt underlag":"walk",
  "Armheving mot vegg":"wallPush"
};

function drawLine(ctx, points, color, width) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  points.forEach(([x,y], index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
}

function drawWeight(ctx, [x,y], gear) {
  ctx.fillStyle = "#a74312";
  if (gear === "kettlebell") {
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.strokeRect(x-3,y-3,6,5);
    ctx.beginPath();
    ctx.arc(x,y+5,5,0,Math.PI*2);
    ctx.fill();
  } else if (gear === "barbell") {
    drawLine(ctx,[[x-12,y],[x+12,y]],ctx.fillStyle,2);
    ctx.fillRect(x-11,y-7,4,14);
    ctx.fillRect(x+7,y-7,4,14);
  } else if (gear === "dumbbell") {
    drawLine(ctx,[[x-6,y],[x+6,y]],ctx.fillStyle,2);
    ctx.fillRect(x-7,y-4,3,8);
    ctx.fillRect(x+4,y-4,3,8);
  }
}

function drawExerciseFigures(root = document) {
  root.querySelectorAll("canvas[data-movement]").forEach(canvas => {
    const direct = canvas.dataset.movement;
    const poses = diagrams[direct] ?? diagrams[movementNames[direct]];
    if (!poses) {
      canvas.hidden = true;
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.hidden = true;
      return;
    }
    const ink = "#242622";
    const accent = "#a74312";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#faf3e9";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const paneWidth = canvas.width / 2;
    drawLine(ctx,[[paneWidth,13],[paneWidth,canvas.height-13]],"#ddcbb6",1);
    poses.forEach((pose,index) => {
      ctx.save();
      ctx.translate(index * paneWidth + (paneWidth-150)/2,0);
      drawLine(ctx,[[16,128],[134,128]],"#d5c4b1",2);
      if (pose.seat) drawLine(ctx,[[54,57],[54,81],[98,81],[98,125]],"#b2a48f",3);
      if (pose.wall) drawLine(ctx,[[112,34],[112,128]],"#b2a48f",3);
      if (pose.step) drawLine(ctx,[[81,128],[81,103],[111,103],[111,128]],"#b2a48f",3);
      [...pose.legs, ...pose.arms].forEach((limb, i) => {
        const group = i < pose.legs.length ? "legs" : "arms";
        drawLine(ctx,limb,pose.active === group ? accent : ink,3.5);
      });
      drawLine(ctx,pose.torso,ink,4.5);
      const [x,y] = pose.torso[0];
      ctx.beginPath();
      ctx.arc(x,y-11,8,0,Math.PI*2);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      const gear = pose.gear ?? canvas.dataset.gear;
      const hands = gear === "dumbbell" ? pose.arms : pose.arms.slice(0,1);
      hands.forEach(arm => drawWeight(ctx,arm.at(-1),gear));
      ctx.fillStyle = ink;
      ctx.font = "600 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(index ? "Bevegelse" : "Start",75,147);
      ctx.restore();
    });
    canvas.hidden = false;
  });
}

drawExerciseFigures();
