import { Main, PerspectiveCameraAuto } from '@three.ez/main';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, Scene, Vector2 } from 'three';
import {
  LineMaterial,
  LineSegmentsGeometry,
  OrbitControls,
  LineSegments2
} from 'three/examples/jsm/Addons.js';
import { InstancedLineSegments2 } from './lines/InstancedLineSegments2.js';

const camera = new PerspectiveCameraAuto().translateZ(10);
const scene = new Scene();
const main = new Main(); // init renderer and other stuff
main.createView({ scene, camera });
const controls = new OrbitControls(camera, main.renderer.domElement);
controls.update();

const geometry = new LineSegmentsGeometry().fromEdgesGeometry(
  new EdgesGeometry(new BoxGeometry())
);

const resolution = new Vector2();
main.renderer.getSize(resolution);

scene.add(line2basic(), line2dashed(), line2one(), line2other());

function line2basic(): InstancedLineSegments2 {
  const basicMaterial = new LineMaterial({ color: 0xff0000, linewidth: 3 });
  basicMaterial.resolution.set(resolution.width, resolution.height);

  const basic = new InstancedLineSegments2(geometry, basicMaterial);
  // basic.computeLineDistances();
  basic.perObjectFrustumCulled = false;
  basic.frustumCulled = false;

  basic.addInstances(9, (obj, index) => {
    obj.position.randomDirection().multiplyScalar(Math.random() * 5);
  });

  return basic;
}

function line2dashed(): InstancedLineSegments2 {
  const dashedMaterial = new LineMaterial({ color: 0x00ff00, linewidth: 2, dashSize: 0.2, gapSize: 0.1 });
  dashedMaterial.resolution.set(resolution.width, resolution.height);

  const dashed = new InstancedLineSegments2(
    geometry,
    dashedMaterial
  );
  dashed.computeLineDistances();
  dashed.perObjectFrustumCulled = false;
  dashed.frustumCulled = false;

  dashed.addInstances(9, (obj, index) => {
    obj.position.randomDirection().multiplyScalar(Math.random() * 5);
  });

  return dashed;
}

function line2one(): LineSegments2 {
  const dashedMaterial = new LineMaterial({ color: 0x00ff00, dashed: true, linewidth: 2, dashSize: 0.2, gapSize: 0.1 });
  dashedMaterial.resolution.set(resolution.width, resolution.height);

  const dashed = new LineSegments2(
    geometry,
    dashedMaterial
  );
  dashed.computeLineDistances();
  dashed.position.set(2, 2, 2);

  return dashed;
}

function line2other(): InstancedLineSegments2 {
  const material = new LineMaterial({ color: 0x0000ff });
  material.resolution.set(resolution.width, resolution.height);

  const dashed = new InstancedLineSegments2(
    geometry,
    material as never
  );
  dashed.perObjectFrustumCulled = false;
  dashed.frustumCulled = false;

  dashed.addInstances(9, (obj, index) => {
    obj.position.randomDirection().multiplyScalar(Math.random() * 5);
  });

  return dashed;
}