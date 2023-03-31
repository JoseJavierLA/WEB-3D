
import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es' //physics

/*Debug*/
const gui = new dat.GUI()
const parameters = {
    materialColor: 'ffffff'
}

/*Models*/
const gltfLoader = new GLTFLoader() //*
let mixer = null

gltfLoader.load(
    
    '/models/Red/redcat.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.5, 0.5, 0.5) //(0.025, 0.025, 0.025)
        gltf.scene.position.set(-2, -1.5, 0) //x,y,z
        scene.add(gltf.scene)   
    }
    
);

gltfLoader.load(
    
    '/models/Blue/bluecat.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.5, 0.5, 0.5) //(0.025, 0.025, 0.025)
        gltf.scene.position.set(2.0, -5.5, 0) 
        scene.add(gltf.scene)
    }
    
)

gltfLoader.load(
    
    '/models/Orange/orangecat.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.5, 0.5, 0.5) //(0.025, 0.025, 0.025)
        gltf.scene.position.set(-2.0, -9.5, 0) //x,y,z
        scene.add(gltf.scene)
    }
    
)

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* Objects */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/* Bubble Lights*/
const bubble1 = new THREE.PointLight('#ff00ff', 3, 3)
bubble1.castShadow = true
bubble1.shadow.mapSize.width = 256
bubble1.shadow.mapSize.height = 256
bubble1.shadow.camera.far = 7
scene.add(bubble1)

const bubble2 = new THREE.PointLight('#00ffff', 3, 3)
bubble2.castShadow = true
bubble2.shadow.mapSize.width = 256
bubble2.shadow.mapSize.height = 256
bubble2.shadow.camera.far = 7
scene.add(bubble2)

const bubble3 = new THREE.PointLight('#ff7800', 3, 3)
bubble3.castShadow = true
bubble3.shadow.mapSize.width = 256
bubble3.shadow.mapSize.height = 256
bubble3.shadow.camera.far = 7
scene.add(bubble3)


// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Objects
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
const mesh4 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.4, 16, 60),
    material
)

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2
mesh4.position.x = -2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh4.position.y = - objectsDistance * 3 

scene.add(mesh1, mesh2, mesh3, mesh4) 

const sectionMeshes = [ mesh1, mesh2, mesh3, mesh4 ]


/* Lights */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/* Particles */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: textureLoader,
    size: 0.03
})


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/* Sizes */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/* Camera */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/* Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* Scroll */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/* Cursor */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/* Animate */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Bubble Lights mov.
    const bubble1Angle = elapsedTime * 0.5
    bubble1.position.x = Math.cos(bubble1Angle) * 4
    bubble1.position.z = Math.sin(bubble1Angle) * 4
    bubble1.position.y = Math.sin(elapsedTime * 3)

    const bubble2Angle = - elapsedTime * 0.32
    bubble2.position.x = Math.cos(bubble2Angle) * 5
    bubble2.position.z = Math.sin(bubble2Angle) * 5
    bubble2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const bubble3Angle = - elapsedTime * 0.18
    bubble3.position.x = Math.cos(bubble3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    bubble3.position.z = Math.sin(bubble3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    bubble3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    ///////////////////////////////////

    /* REFERENCIA PARA IMPLEMENTAR (physics) 31/03/2023 */
    class Rain
    {
        constructor()
        {
            experience = new Experience()
            this.scene = this.experience.scene
            this.world = this.experience.world
            this.resources = this.experience.resources
    
            this.radius = 0.01
    
            this.setGeometry()
            this.setTextures()
            this.setMaterial()
            this.setMesh()
            this.setPhysics()
        }
    
        setGeometry()
        {
            this.geometry = new THREE.IcosahedronGeometry(this.radius)
        }
    
        setTextures()
        {
    
        }
    
        setMaterial()
        {
            this.material = new THREE.MeshStandardMaterial({
                color: '#ffffff',
            })
        }
    
        setRandomPosition(){
            let xPos = (Math.random() > 0.5 ? -1 : 1 ) * Math.random()* 5
            let yPos = 2 + Math.random()*5
            let zPos = (Math.random() > 0.5 ? -1 : 1 ) * Math.random()* 5
            this.mesh.position.set(xPos,yPos, zPos)
        }
    
        setMesh()
        {
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.setRandomPosition()
            this.scene.add(this.mesh)
        }
    
        setPhysics(){
            this.shape = new CANNON.Sphere(this.radius)
            this.body = new CANNON.Body({
                mass: 0.1,
                position: new CANNON.Vec3(0, 0, 0),
                shape: this.shape,
                material: this.world.defaultMaterial
            })
            this.body.position.copy(this.mesh.position)
            let xDir = (Math.random() > 0.5 ? -1 : 1 ) * Math.random()* 15
            let yDir = Math.random()
            let zDir = (Math.random() > 0.5 ? -1 : 1 ) * Math.random()* 15
            this.body.applyLocalForce(new CANNON.Vec3(xDir, yDir, zDir), new CANNON.Vec3(0,0,0))
            this.world.physicsWorld.addBody(this.body)
        }
    
        update(){
            if(this.body.position.y < -0.05){
                this.body.velocity.set(0,0.0,0)
                this.setRandomPosition()
                this.body.position.copy(this.mesh.position)
            }
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)
        }
    }
    // END PHYSICS REF !
    ////////////////////////////////

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//JJ

