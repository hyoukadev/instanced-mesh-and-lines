import { Vector3, Float32BufferAttribute, ShaderChunk, ShaderLib, BufferGeometry, Material } from 'three';

import { InstancedMesh2, InstancedMesh2Params } from '../../src/index.js';

const _start = /* @__PURE__ */ new Vector3();

const _end = /* @__PURE__ */ new Vector3();

// dashline 不兼容 InstancedMesh2，会报错误：'instanceMatrix' : undeclared identifier

// 调试过程，先弄明白为什么会报错

// 1. 在 WebGLShader 中 print 对比 material 区别

// 2. 对比 three.js 和 instanced-mesh 源码对 Shader 的处理

// 3. 发现 instanced-mesh patchShader 没有对 LineDashedMaterial 生效，因为其缺少部分 include

// 4. 运用同样原理像下面这样 patch

ShaderLib.dashed.vertexShader = ((shader) => {
  // https://github.com/mrdoob/three.js/blob/1bac6346777cd45e1d4ab5071f9527c86be62b81/src/renderers/shaders/ShaderLib/linedashed.glsl.js#L7

  // https://github.com/mrdoob/three.js/blob/1bac6346777cd45e1d4ab5071f9527c86be62b81/src/renderers/shaders/ShaderLib/meshbasic.glsl.js#L3

  // https://github.com/agargaro/instanced-mesh/blob/02ada425e400d59722ce53c8a175756dc7f2bacf/src/shaders/ShaderChunk.ts#L26

  return (
    shader
      .replace(
        '#include <common>',
        '#include <common>\n#include <batching_pars_vertex>'
      )

    // https://github.com/mrdoob/three.js/blob/1bac6346777cd45e1d4ab5071f9527c86be62b81/src/renderers/shaders/ShaderLib/meshbasic.glsl.js#L19

    // https://github.com/mrdoob/three.js/blob/1bac6346777cd45e1d4ab5071f9527c86be62b81/src/renderers/shaders/ShaderLib/linedashed.glsl.js#L22

    // https://github.com/agargaro/instanced-mesh/blob/02ada425e400d59722ce53c8a175756dc7f2bacf/src/shaders/ShaderChunk.ts#L28

      .replace(
        '#include <morphcolor_vertex>',
        '#include <morphcolor_vertex>\n#include <batching_vertex>'
      )
  );
})(ShaderLib.dashed.vertexShader);

export class InstancedLineSegments extends InstancedMesh2 {
  override readonly type: 'InstancedLineSegments';

  override isMesh: false;

  isLine: true;

  isLineSegments: true;

  constructor(geometry: BufferGeometry, material: Material | Material[], params?: InstancedMesh2Params) {
    super(geometry, material, params);

    this.type = 'InstancedLineSegments';

    this.isMesh = false;

    this.isLine = true;

    this.isLineSegments = true;

    // already set in InstancedMesh2
    // this.isInstancedMesh = true
  }

  computeLineDistances(): this {
    const geometry = this.geometry;

    // we assume non-indexed geometry

    if (geometry.index === null) {
      const positionAttribute = geometry.attributes.position;

      const lineDistances = [];

      for (let i = 0, l = positionAttribute.count; i < l; i += 2) {
        _start.fromBufferAttribute(positionAttribute, i);

        _end.fromBufferAttribute(positionAttribute, i + 1);

        lineDistances[i] = i === 0 ? 0 : lineDistances[i - 1];

        lineDistances[i + 1] = lineDistances[i] + _start.distanceTo(_end);
      }

      geometry.setAttribute(
        'lineDistance',
        new Float32BufferAttribute(lineDistances, 1)
      );
    } else {
      console.warn(
        'THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.'
      );
    }

    return this;
  }
}
