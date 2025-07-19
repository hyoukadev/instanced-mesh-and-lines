import { Main, PerspectiveCameraAuto } from '@three.ez/main';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineDashedMaterial, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { InstancedLineSegments } from './lines/InstancedLineSegments.js';

const camera = new PerspectiveCameraAuto().translateZ(10);
const scene = new Scene();
const main = new Main(); // init renderer and other stuff
main.createView({ scene, camera });
const controls = new OrbitControls(camera, main.renderer.domElement);
controls.update();

const basic = new InstancedLineSegments(
  new EdgesGeometry(new BoxGeometry()),
  new LineBasicMaterial({ color: 'red' })
);

const dashed = new InstancedLineSegments(
  new EdgesGeometry(new BoxGeometry()),
  new LineDashedMaterial({ color: 'green', dashSize: 0.2, gapSize: 0.1 })
);
dashed.computeLineDistances();
scene.add(basic, dashed);

basic.addInstances(9, (obj, index) => {
  obj.position.randomDirection().multiplyScalar(Math.random() * 5);
});

dashed.addInstances(9, (obj, index) => {
  obj.position.randomDirection().multiplyScalar(Math.random() * 5);
});
