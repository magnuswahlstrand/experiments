/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, {useRef} from 'react'
import {useGLTF,} from '@react-three/drei'


export default function Model(props) {
    const group = useRef()
    const {
        nodes,
        materials
    } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/zombie-car/model.gltf')
    return (
        <group ref={group} {...props} dispose={null}>
            <group scale={0.1}>
                <mesh geometry={nodes.Cylinder018_Cylinder007.geometry} material={materials.Car} castShadow/>
                <mesh geometry={nodes.Cylinder018_Cylinder007_1.geometry} material={materials.Windshield} castShadow/>
            </group>

        </group>
    )
}

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/zombie-car/model.gltf')
