import * as THREE from 'three';

// Three.js-City stores the Skyline meshes in the pre-BufferGeometry JSON format.
// This compact parser converts its triangle/quad face stream to modern geometry.
export function parseLegacyGeometry(data) {
  const positions=[], normals=[];
  const vertices=data.vertices||[], sourceNormals=data.normals||[], faces=data.faces||[];
  let offset=0;
  const vertex=(index)=>[vertices[index*3],vertices[index*3+1],vertices[index*3+2]];
  const normal=(index)=>[sourceNormals[index*3],sourceNormals[index*3+1],sourceNormals[index*3+2]];
  while(offset<faces.length){
    const type=faces[offset++], quad=type&1, count=quad?4:3;
    const indices=faces.slice(offset,offset+count); offset+=count;
    if(type&2) offset++;
    const uvLayers=(data.uvs||[]).filter(layer=>layer.length).length;
    if(type&4) offset+=uvLayers;
    if(type&8) offset+=uvLayers*count;
    let faceNormal=null, vertexNormals=null;
    if(type&16) faceNormal=normal(faces[offset++]);
    if(type&32){vertexNormals=faces.slice(offset,offset+count).map(normal);offset+=count;}
    if(type&64) offset++;
    if(type&128) offset+=count;
    const triangles=quad?[[0,1,3],[1,2,3]]:[[0,1,2]];
    triangles.forEach(triangle=>triangle.forEach(i=>{
      positions.push(...vertex(indices[i]));
      if(vertexNormals) normals.push(...vertexNormals[i]); else if(faceNormal) normals.push(...faceNormal);
    }));
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  if(normals.length===positions.length) geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3)); else geometry.computeVertexNormals();
  geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  return geometry;
}

const parts=['body','windows','lights-front','lights-back','interior','exhaust','tire','rim'];
let geometryPromise;
export function loadSkylineGeometry(){
  if(!geometryPromise) geometryPromise=Promise.all(parts.map(async part=>{
    const response=await fetch(`/models/skyline/${part}.json`);
    if(!response.ok) throw new Error(`Unable to load Skyline ${part}`);
    return [part,parseLegacyGeometry(await response.json())];
  })).then(Object.fromEntries);
  return geometryPromise;
}
