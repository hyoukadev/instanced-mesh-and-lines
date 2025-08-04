import { Main, PerspectiveCameraAuto } from '@three.ez/main';
import { BoxGeometry, DoubleSide, EdgesGeometry, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshNormalMaterial, Scene, LineSegments, LessCompare } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { InstancedLineSegments } from './lines/InstancedLineSegments.js'
import { InstancedMesh2 } from '../src/index.js';

const camera = new PerspectiveCameraAuto().translateZ(10);
const scene = new Scene();
const main = new Main(); // init renderer and other stuff
main.createView({ scene, camera });
const controls = new OrbitControls(camera, main.renderer.domElement);
controls.update();


const geo = {
    box: new BoxGeometry(),
    lines: new EdgesGeometry(new BoxGeometry())
}
const mat = {
    green: new MeshBasicMaterial({
        transparent: true, opacity: 0.6, color: 'green',
        // side: DoubleSide
    }),
    red: new MeshBasicMaterial({
        transparent: true, opacity: 0.6, color: 'red',
        // side: DoubleSide
    }),
    redLine: new LineBasicMaterial({ color: 'red', depthTest: true, depthWrite: true })
}
const boxes = new InstancedMesh2(geo.box, mat.green);
scene.add(boxes);
boxes.addInstances(1, (obj, index) => {
    obj.position.set(1, 1, 1)
});

const boxes2 = new InstancedMesh2(geo.box, mat.red);
scene.add(boxes2);
boxes2.addInstances(1, (obj, index) => {
    obj.position.set(1.5, 1.5, 1.5)
});


const boxA = new Mesh(geo.box, mat.green)
const boxB = new Mesh(geo.box, mat.red)
boxB.position.set(0.5, 0.5, 0.5)
scene.add(boxA, boxB)


const lines = new InstancedLineSegments(geo.lines, mat.redLine);
scene.add(lines);
lines.addInstances(1, (obj, index) => {
    obj.position.set(1.5, 1.5, 1.5)
});

const line = new LineSegments(geo.lines, mat.redLine)
scene.add(line)
line.position.set(0.5, 0.5, 0.5)