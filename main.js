// Basic interactivity: hamburger + pointer-driven parallax for project cards
document.addEventListener('DOMContentLoaded', () => {

  
  const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');

      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);

});

  
  // === HERO LAYER PARALLAX (5-layer movement) ===
  const heroLayers = document.getElementById('hero-layers');
  if (heroLayers) {
    const layers = heroLayers.querySelectorAll('.layer');
    heroLayers.addEventListener('mousemove', (e) => {
      const rect = heroLayers.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX;
      const moveY = (y - centerY) / centerY;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 8;
        const rotate = (i + 1) * 1.2;
        layer.style.transform = `
          translate(-50%, -50%) 
          translateX(${moveX * depth}px)
          translateY(${moveY * depth}px)
          rotateY(${moveX * rotate}deg)
          rotateX(${-moveY * rotate}deg)
        `;
      });
    });

    heroLayers.addEventListener('mouseleave', () => {
      layers.forEach(layer => {
        layer.style.transform = 'translate(-50%, -50%)';
      });
    });
  }




  //<!-- HERO PARALLAX — float + Synty-style hover depth -->
  
  document.addEventListener('DOMContentLoaded', function(){
    var heroLayers = document.getElementById('hero-layers');
    if(!heroLayers) return;

    var layers  = heroLayers.querySelectorAll('.layer');
    /* Synty-style depth — each layer moves significantly more than the last */
    var depths  = [4, 10, 20, 28, 15];
    var rotates = [.7, 1.5, 3.0, 4.2, 2.2];
    var currX=0, currY=0, targetX=0, targetY=0;
    var hovering = false;

    heroLayers.addEventListener('mousemove', function(e){
      hovering = true;
      heroLayers.classList.add('is-hovered');
      var r = heroLayers.getBoundingClientRect();
      /* normalise -1 to 1 */
      targetX = (e.clientX - r.left  - r.width/2)  / (r.width/2);
      targetY = (e.clientY - r.top   - r.height/2) / (r.height/2);
    });

    heroLayers.addEventListener('mouseleave', function(){
      hovering = false;
      heroLayers.classList.remove('is-hovered');
      targetX = 0; targetY = 0;
    });

    function animParallax(){
      requestAnimationFrame(animParallax);
      /* smooth damp */
      currX += (targetX - currX) * .07;
      currY += (targetY - currY) * .07;

      /* only override transform when actually moved */
      if(hovering || Math.abs(currX) > 0.002 || Math.abs(currY) > 0.002){
        layers.forEach(function(layer, i){
          var d = depths[i]  || 8;
          var r = rotates[i] || 1.5;
          layer.style.transform =
            'translate(-50%,-50%)' +
            ' translateX(' + (currX * d)  + 'px)' +
            ' translateY(' + (currY * d)  + 'px)' +
            ' rotateY('    + (currX * r)  + 'deg)' +
            ' rotateX('    + (-currY * r) + 'deg)';
        });
      }
    }
    animParallax();

    /* year */
    var yr = document.getElementById('year');
    if(yr) yr.textContent = new Date().getFullYear();
  });
  

  //<!-- HERO PARTICLE BG -->
  
  (function(){
    var canvas = document.getElementById('particle-canvas');
    var hero   = document.getElementById('hero');
    if(!canvas || !hero || typeof THREE === 'undefined') return;

    var W = hero.clientWidth, H = hero.clientHeight;
    var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H);
    renderer.setClearColor(0xffffff,0);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60,W/H,0.1,200);
    camera.position.z = 7;

    window.addEventListener('resize',function(){
      W=hero.clientWidth; H=hero.clientHeight;
      renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
    });

    function makeCloud(n,col,sz,op){
      var geo=new THREE.BufferGeometry();
      var pos=new Float32Array(n*3), vel=new Float32Array(n*3);
      for(var i=0;i<n;i++){
        pos[i*3]  =(Math.random()-.5)*22;
        pos[i*3+1]=(Math.random()-.5)*14;
        pos[i*3+2]=(Math.random()-.5)*5;
        vel[i*3]  =(Math.random()-.5)*.0016;
        vel[i*3+1]=(Math.random()-.5)*.0013;
        vel[i*3+2]=0;
      }
      geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:col,size:sz,transparent:true,opacity:op,sizeAttenuation:true})));
      return {geo:geo,vel:vel,n:n};
    }

    var red  = makeCloud(55,0xff2c2c,.048,.25);
    var purp = makeCloud(38,0x7722cc,.038,.16);
    var dark = makeCloud(25,0x0e0b15,.03,.10);

    var mX=0,mY=0,cX=0,cY=0;
    window.addEventListener('mousemove',function(e){
      mX=(e.clientX/window.innerWidth-.5)*2;
      mY=(e.clientY/window.innerHeight-.5)*2;
    });

    function tick(p){
      var a=p.geo.attributes.position.array;
      for(var i=0;i<p.n;i++){
        a[i*3]+=p.vel[i*3]; a[i*3+1]+=p.vel[i*3+1];
        if(Math.abs(a[i*3])>11)  p.vel[i*3]*=-1;
        if(Math.abs(a[i*3+1])>7) p.vel[i*3+1]*=-1;
      }
      p.geo.attributes.position.needsUpdate=true;
    }

    function animate(){
      requestAnimationFrame(animate);
      cX+=(mX-cX)*.04; cY+=(mY-cY)*.04;
      camera.position.x+=(cX*.22-camera.position.x)*.04;
      camera.position.y+=(-cY*.16-camera.position.y)*.04;
      tick(red); tick(purp); tick(dark);
      renderer.render(scene,camera);
    }
    animate();
  })();
  

  //<!-- SKILLS GLOBE -->
  
  (function(){
    var wrapEl=document.getElementById('globeWrap');
    var canvas=document.getElementById('globe-canvas');
    if(!wrapEl||!canvas||typeof THREE==='undefined') return;

    var W,H;
    function gs(){ W=wrapEl.clientWidth; H=wrapEl.clientHeight; }
    gs();

    var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H);
    renderer.setClearColor(0x050505,1);

    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,W/H,0.1,500);
    camera.position.z=5.2;

    window.addEventListener('resize',function(){ gs(); renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix(); });
    scene.add(new THREE.AmbientLight(0xffffff,2));
    var dl=new THREE.DirectionalLight(0xffffff,1.5); dl.position.set(5,5,5); scene.add(dl);

    var skills=[
      {name:'WordPress',  cat:'web',    lat:25, lon:10 },{name:'Shopify',    cat:'web',    lat:42, lon:65 },
      {name:'HTML/CSS/JS',cat:'web',    lat:-12,lon:35 },{name:'Three.js',   cat:'3d',     lat:58, lon:125},
      {name:'Unity',      cat:'3d',     lat:32, lon:175},{name:'SEO/SEM',    cat:'data',   lat:-38,lon:85 },
      {name:'GA4',        cat:'data',   lat:-58,lon:25 },{name:'AI Tools',   cat:'ai',     lat:12, lon:205},
      {name:'n8n',        cat:'ai',     lat:-18,lon:245},{name:'OpenAI API', cat:'ai',     lat:28, lon:285},
      {name:'Python',     cat:'data',   lat:-42,lon:305},{name:'Data Viz',   cat:'data',   lat:62, lon:315},
      {name:'UX Design',  cat:'web',    lat:72, lon:205},{name:'cPanel/WHM', cat:'web',    lat:-72,lon:155},
      {name:'Automation', cat:'ai',     lat:2,  lon:335},{name:'Adobe Suite',cat:'design', lat:-28,lon:185},
      {name:'Figma',      cat:'design', lat:48, lon:255},
    ];
    var conns=[
      [0,1],[0,2],[0,5],[1,2],[1,5],[2,3],[2,16],[3,4],[5,6],[6,10],[6,11],
      [7,8],[7,9],[8,9],[8,14],[9,14],[7,11],[10,11],[15,16],[15,12],[16,12],
      [0,13],[2,13],[3,12],[4,12],[7,3],[14,8],
    ];
    var cc={web:0x4488ff,data:0x00ddaa,ai:0xff3131,'3d':0xaa44ff,design:0xff8844};
    var R=2.0;

    function v3(lat,lon,r){
      var p=(90-lat)*(Math.PI/180),t=(lon+180)*(Math.PI/180);
      return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));
    }

    var pivot=new THREE.Group(); scene.add(pivot);
    pivot.add(new THREE.Mesh(new THREE.SphereGeometry(R,28,28),new THREE.MeshBasicMaterial({color:0x2a1f45,wireframe:true,transparent:true,opacity:.09})));
    pivot.add(new THREE.Mesh(new THREE.SphereGeometry(R*.97,28,28),new THREE.MeshBasicMaterial({color:0x050505,transparent:true,opacity:.7})));

    var np=skills.map(function(s){ return v3(s.lat,s.lon,R); });

    var los=[];
    conns.forEach(function(c){
      var pts=[];
      for(var s=0;s<=24;s++){ var vv=new THREE.Vector3().lerpVectors(np[c[0]],np[c[1]],s/24); vv.normalize().multiplyScalar(R+.015); pts.push(vv); }
      var lo=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x3a2f66,transparent:true,opacity:.4}));
      lo.userData.a=c[0]; lo.userData.b=c[1]; pivot.add(lo); los.push(lo);
    });

    var nm=skills.map(function(s,i){
      var col=cc[s.cat];
      var m=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.8,roughness:.2}));
      m.position.copy(np[i]); m.userData.index=i; pivot.add(m); return m;
    });

    var les=skills.map(function(s){
      var el=document.createElement('div'); el.className='skill-label'; el.textContent=s.name;
      wrapEl.appendChild(el); return el;
    });

    var rc=new THREE.Raycaster(), m2=new THREE.Vector2(-999,-999), hi=-1;
    canvas.addEventListener('mousemove',function(e){ var r=canvas.getBoundingClientRect(); m2.x=((e.clientX-r.left)/W)*2-1; m2.y=-((e.clientY-r.top)/H)*2+1; });
    canvas.addEventListener('mouseleave',function(){ m2.set(-999,-999); hi=-1; });

    var isDrag=false,px=0,py=0,ar=true,vx=0;
    canvas.addEventListener('mousedown',function(e){ isDrag=true; ar=false; px=e.clientX; py=e.clientY; vx=0; });
    window.addEventListener('mouseup',function(){ isDrag=false; setTimeout(function(){ ar=true; },2500); });
    canvas.addEventListener('mousemove',function(e){ if(!isDrag)return; var dx=e.clientX-px,dy=e.clientY-py; pivot.rotation.y+=dx*.009; pivot.rotation.x+=dy*.009; vx=dx*.009; px=e.clientX; py=e.clientY; });

    function gc(idx){ var o=[]; conns.forEach(function(c){ if(c[0]===idx)o.push(c[1]); if(c[1]===idx)o.push(c[0]); }); return o; }
    function ts(vv){ var p=vv.clone(); p.applyMatrix4(pivot.matrixWorld); p.project(camera); return {x:(p.x*.5+.5)*W,y:(-p.y*.5+.5)*H,z:p.z}; }

    function animate(){
      requestAnimationFrame(animate);
      if(ar) pivot.rotation.y+=.0008; else if(!isDrag){ vx*=.94; pivot.rotation.y+=vx; }

      rc.setFromCamera(m2,camera);
      var hits=rc.intersectObjects(nm); hi=hits.length>0?hits[0].object.userData.index:-1;

      nm.forEach(function(n){ n.material.emissiveIntensity=1.8; n.scale.setScalar(1); });
      los.forEach(function(l){ l.material.color.setHex(0x3a2f66); l.material.opacity=.4; });

      if(hi>=0){
        var co=gc(hi);
        nm[hi].material.emissiveIntensity=5.5; nm[hi].scale.setScalar(1.85);
        co.forEach(function(c){ nm[c].material.emissiveIntensity=3.2; nm[c].scale.setScalar(1.3); });
        los.forEach(function(l){ if(l.userData.a===hi||l.userData.b===hi){ l.material.color.setHex(0xff3131); l.material.opacity=1; } });
      }

      var ch=hi>=0?gc(hi):[];
      skills.forEach(function(s,i){
        var sc=ts(np[i]),el=les[i];
        if(sc.z>1){ el.style.opacity='0'; return; }
        var op=.28+Math.max(0,1-sc.z*1.05)*.72;
        el.style.left=sc.x+'px'; el.style.top=sc.y+'px'; el.style.opacity=op.toFixed(2);
        el.className='skill-label';
        if(i===hi){ el.classList.add('active'); el.style.opacity='1'; }
        else if(ch.indexOf(i)>=0){ el.classList.add('connected'); el.style.opacity='1'; }
      });

      renderer.render(scene,camera);
    }
    animate();
  })();
  

// === three.js globe (5-layer movement) ===






//<!-- SKILLS GLOBE -->

(function(){
    var wrapEl=document.getElementById('globeWrap');
    var canvas=document.getElementById('globe-canvas');
    if(!wrapEl||!canvas||typeof THREE==='undefined') return;

    var W,H;
    function gs(){ W=wrapEl.clientWidth; H=wrapEl.clientHeight; }
    gs();

    var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H);
    renderer.setClearColor(0x120e1a,1);

    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,W/H,0.1,500);
    camera.position.z=5.2;

    window.addEventListener('resize',function(){ gs(); renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix(); });
    scene.add(new THREE.AmbientLight(0xffffff,2));
    var dl=new THREE.DirectionalLight(0xffffff,1.5); dl.position.set(5,5,5); scene.add(dl);

    var skills=[
      {name:'WordPress',  cat:'web',    lat:25, lon:10 },{name:'Shopify',    cat:'web',    lat:42, lon:65 },
      {name:'HTML/CSS/JS',cat:'web',    lat:-12,lon:35 },{name:'Three.js',   cat:'3d',     lat:58, lon:125},
      {name:'Unity',      cat:'3d',     lat:32, lon:175},{name:'SEO/SEM',    cat:'data',   lat:-38,lon:85 },
      {name:'GA4',        cat:'data',   lat:-58,lon:25 },{name:'AI Tools',   cat:'ai',     lat:12, lon:205},
      {name:'n8n',        cat:'ai',     lat:-18,lon:245},{name:'OpenAI API', cat:'ai',     lat:28, lon:285},
      {name:'Python',     cat:'data',   lat:-42,lon:305},{name:'Data Viz',   cat:'data',   lat:62, lon:315},
      {name:'UX Design',  cat:'web',    lat:72, lon:205},{name:'cPanel/WHM', cat:'web',    lat:-72,lon:155},
      {name:'Automation', cat:'ai',     lat:2,  lon:335},{name:'Adobe Suite',cat:'design', lat:-28,lon:185},
      {name:'Figma',      cat:'design', lat:48, lon:255},
    ];
    var conns=[
      [0,1],[0,2],[0,5],[1,2],[1,5],[2,3],[2,16],[3,4],[5,6],[6,10],[6,11],
      [7,8],[7,9],[8,9],[8,14],[9,14],[7,11],[10,11],[15,16],[15,12],[16,12],
      [0,13],[2,13],[3,12],[4,12],[7,3],[14,8],
    ];
    var cc={web:0x4488ff,data:0x00ddaa,ai:0xff3131,'3d':0xaa44ff,design:0xff8844};
    var R=2.0;

    function v3(lat,lon,r){
      var p=(90-lat)*(Math.PI/180),t=(lon+180)*(Math.PI/180);
      return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));
    }

    var pivot=new THREE.Group(); scene.add(pivot);
    pivot.add(new THREE.Mesh(new THREE.SphereGeometry(R,28,28),new THREE.MeshBasicMaterial({color:0x2a1f45,wireframe:true,transparent:true,opacity:.09})));
    pivot.add(new THREE.Mesh(new THREE.SphereGeometry(R*.97,28,28),new THREE.MeshBasicMaterial({color:0x050505,transparent:true,opacity:.7})));

    var np=skills.map(function(s){ return v3(s.lat,s.lon,R); });

    var los=[];
    conns.forEach(function(c){
      var pts=[];
      for(var s=0;s<=24;s++){ var vv=new THREE.Vector3().lerpVectors(np[c[0]],np[c[1]],s/24); vv.normalize().multiplyScalar(R+.015); pts.push(vv); }
      var lo=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x3a2f66,transparent:true,opacity:.4}));
      lo.userData.a=c[0]; lo.userData.b=c[1]; pivot.add(lo); los.push(lo);
    });

    var nm=skills.map(function(s,i){
      var col=cc[s.cat];
      var m=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.8,roughness:.2}));
      m.position.copy(np[i]); m.userData.index=i; pivot.add(m); return m;
    });

    var les=skills.map(function(s){
      var el=document.createElement('div'); el.className='skill-label'; el.textContent=s.name;
      wrapEl.appendChild(el); return el;
    });

    var rc=new THREE.Raycaster(), m2=new THREE.Vector2(-999,-999), hi=-1;
    canvas.addEventListener('mousemove',function(e){ var r=canvas.getBoundingClientRect(); m2.x=((e.clientX-r.left)/W)*2-1; m2.y=-((e.clientY-r.top)/H)*2+1; });
    canvas.addEventListener('mouseleave',function(){ m2.set(-999,-999); hi=-1; });

    var isDrag=false,px=0,py=0,ar=true,vx=0;
    canvas.addEventListener('mousedown',function(e){ isDrag=true; ar=false; px=e.clientX; py=e.clientY; vx=0; });
    window.addEventListener('mouseup',function(){ isDrag=false; setTimeout(function(){ ar=true; },2500); });
    canvas.addEventListener('mousemove',function(e){ if(!isDrag)return; var dx=e.clientX-px,dy=e.clientY-py; pivot.rotation.y+=dx*.009; pivot.rotation.x+=dy*.009; vx=dx*.009; px=e.clientX; py=e.clientY; });

    function gc(idx){ var o=[]; conns.forEach(function(c){ if(c[0]===idx)o.push(c[1]); if(c[1]===idx)o.push(c[0]); }); return o; }
    function ts(vv){ var p=vv.clone(); p.applyMatrix4(pivot.matrixWorld); p.project(camera); return {x:(p.x*.5+.5)*W,y:(-p.y*.5+.5)*H,z:p.z}; }

    function animate(){
      requestAnimationFrame(animate);
      if(ar) pivot.rotation.y+=.0008; else if(!isDrag){ vx*=.94; pivot.rotation.y+=vx; }

      rc.setFromCamera(m2,camera);
      var hits=rc.intersectObjects(nm); hi=hits.length>0?hits[0].object.userData.index:-1;

      nm.forEach(function(n){ n.material.emissiveIntensity=1.8; n.scale.setScalar(1); });
      los.forEach(function(l){ l.material.color.setHex(0x3a2f66); l.material.opacity=.4; });

      if(hi>=0){
        var co=gc(hi);
        nm[hi].material.emissiveIntensity=5.5; nm[hi].scale.setScalar(1.85);
        co.forEach(function(c){ nm[c].material.emissiveIntensity=3.2; nm[c].scale.setScalar(1.3); });
        los.forEach(function(l){ if(l.userData.a===hi||l.userData.b===hi){ l.material.color.setHex(0xff3131); l.material.opacity=1; } });
      }

      var ch=hi>=0?gc(hi):[];
      skills.forEach(function(s,i){
        var sc=ts(np[i]),el=les[i];
        if(sc.z>1){ el.style.opacity='0'; return; }
        var op=.28+Math.max(0,1-sc.z*1.05)*.72;
        el.style.left=sc.x+'px'; el.style.top=sc.y+'px'; el.style.opacity=op.toFixed(2);
        el.className='skill-label';
        if(i===hi){ el.classList.add('active'); el.style.opacity='1'; }
        else if(ch.indexOf(i)>=0){ el.classList.add('connected'); el.style.opacity='1'; }
      });

      renderer.render(scene,camera);
    }
    animate();
  })();

  







  // === SLIDER BUTTONS ===
  const slider = document.getElementById('project-slider');
  const next = document.querySelector('.slider-btn.next');
  const prev = document.querySelector('.slider-btn.prev');

  if (slider && next && prev) {
    next.addEventListener('click', () => {
      slider.scrollBy({ left: slider.offsetWidth * 0.8, behavior: 'smooth' });
    });
    prev.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.offsetWidth * 0.8, behavior: 'smooth' });
    });
  }

  // === PROJECT CARD POINTER PARALLAX ===
  const cards = document.querySelectorAll('.card-inner[data-mouse-depth="true"]');
  cards.forEach(card => {
    const layers = card.querySelectorAll('.layer');
    card.addEventListener('pointermove', ev => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (ev.clientX - cx) / r.width;
      const dy = (ev.clientY - cy) / r.height;
      layers.forEach((layer, i) => {
        const depth = layer.classList.contains('back') ? -12 : layer.classList.contains('mid') ? -6 : 0;
        const tx = dx * (10 + (i * 6)) * (depth < 0 ? -1 : 1);
        const ty = dy * (10 + (i * 6)) * (depth < 0 ? -1 : 1);
        const rot = dx * (i - 1) * 3;
        layer.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) translateZ(${(i * 10)}px) rotateY(${rot}deg)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      layers.forEach(layer => layer.style.transform = 'translate(-50%,-50%) translateZ(0) rotateY(0deg)');
    });
  });

  // === AUTO-SCROLL FOR FEATURED PROJECTS ===
  if (slider) {
    let isHovered = false;
    let autoScroll;

    function startAutoScroll() {
      stopAutoScroll();
      autoScroll = setInterval(() => {
        if (!isHovered) {
          slider.scrollLeft += 1; // adjust scroll speed (1–3 works best)
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
            slider.scrollLeft = 0;
          }
        }
      }, 16); // ~60fps
    }

    function stopAutoScroll() {
      if (autoScroll) clearInterval(autoScroll);
    }

    slider.addEventListener("mouseenter", () => (isHovered = true));
    slider.addEventListener("mouseleave", () => (isHovered = false));

    startAutoScroll();
  }
// === SCROLL REVEAL FOR #projects .project-block ===
const projectBlocks = document.querySelectorAll('#projects .project-block');
if (projectBlocks.length) {
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io2.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  projectBlocks.forEach((block) => io2.observe(block));
}


  // === FOOTER YEAR ===
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

});
