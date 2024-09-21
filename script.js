let scene, camera, renderer, giftBox, flowers;
let clicked = false;

init();
animate();

function init() {
    // Crear la escena
    scene = new THREE.Scene();

    // Crear la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Crear el renderizador
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Añadir una luz ambiental (ilumina todo de forma uniforme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Luz blanca con intensidad 1
    scene.add(ambientLight);

    // Añadir una luz direccional (ilumina desde una dirección específica)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Luz blanca con intensidad 0.5
    directionalLight.position.set(5, 5, 5); // Posicionar la luz en la escena
    scene.add(directionalLight);

    // Cargar la caja de regalo usando GLTFLoader
    const loader = new THREE.GLTFLoader();
    loader.load('assets/gift_box.glb', function(gltf) {
        giftBox = gltf.scene;
        giftBox.scale.set(1, 1, 1);
        scene.add(giftBox);
    });

    // Cargar las flores, pero inicializarlas invisibles
    loader.load('assets/flowers_model.glb', function(gltf) {
        flowers = gltf.scene;
        flowers.scale.set(0, 0, 0); // Ocultar inicialmente
        scene.add(flowers);
    });

    // Añadir el evento de click a la escena
    document.getElementById('scene').addEventListener('click', handleClick);
}

function handleClick() {
    if (!clicked) {
        clicked = true;

        // Animación para hacer desaparecer la caja de regalo
        gsap.to(giftBox.scale, { duration: 1, x: 0., y: 0, z: 0, onComplete: showFlowers });

        // Ocultar la instrucción de click
        document.getElementById('click-instruction').style.display = 'none';
    }
}

function showFlowers() {
    // Mostrar las flores con una animación
    gsap.to(flowers.scale, { duration: 2, x: 2, y: 2, z: 2 });

    // Mostrar la dedicatoria
    document.getElementById('dedication').style.display = 'block';
    gsap.fromTo('#dedication', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotar la caja de regalo mientras esté visible
    if (giftBox && !clicked) {
        giftBox.rotation.y += 0.01;
    }

    // Rotar las flores después del click
    if (flowers && clicked) {
        flowers.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Ajustar el renderizado al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
