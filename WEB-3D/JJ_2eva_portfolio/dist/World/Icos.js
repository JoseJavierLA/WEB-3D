var $container=$("#container"),renderer=new THREE.WebGLRenderer({antialias:!0});scene.add(camera),renderer.setSize(800,800),$container.append(renderer.domElement),camera.position.z=200;var pinkMat=new THREE.MeshPhongMaterial({color:new THREE.Color("rgb(226,35,213)"),emissive:new THREE.Color("rgb(255,128,64)"),specular:new THREE.Color("rgb(255,155,255)"),shininess:10,shading:THREE.FlatShading,transparent:1,opacity:1}),L1=new THREE.PointLight(16777215,1);L1.position.z=100,L1.position.y=100,L1.position.x=100,scene.add(L1);var L2=new THREE.PointLight(16777215,.8);L2.position.z=200,L2.position.y=50,L2.position.x=-100,scene.add(L2);var Ico=new THREE.Mesh(new THREE.IcosahedronGeometry(75,1),pinkMat);function update(){Ico.rotation.x+=.02,Ico.rotation.y+=.02}function render(){requestAnimationFrame(render),renderer.render(scene,camera),update()}Ico.rotation.z=.5,scene.add(Ico),render();