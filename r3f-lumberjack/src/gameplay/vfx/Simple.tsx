import {Composable, Modules} from "material-composer-r3f"
import {bitmask, Layers} from "render-composer"
import {Mix, Mul, Smoothstep, Vec3} from "shader-composer"
import {createParticleLifetime} from "vfx-composer"
import {Emitter, EmitterProps, InstancedParticles, useParticleLifetime} from "vfx-composer-r3f"
import {ECS} from "../state"
import {useTexture} from "@react-three/drei";
import {between, upTo} from "randomish";



// export const InstanceRNG =
//     ({seed}: { seed?: Input<"float"> } = {}) =>
//         (offset: Input<"float"> = Math.random() * 10) =>
//             Random($`${offset} + float(${InstanceID}) * 1.1005`)

export const SmokeVFX = () => {
    const lifetime = useParticleLifetime()
    const rng = (n) => Math.random() * 10 + n

    const direction = Vec3([
        Mix(-0.5, 0.5, rng(12)),
        Mix(-0.5, 0.5, rng(17)),
        Mix(-0.5, 0.5, rng(1))
    ])

    const texture = useTexture("https://raw.githubusercontent.com/hmans/composer-suite/dev/apps/vfx-composer-examples/src/examples/textures/smoke.png")

    return (
        <InstancedParticles
            name="SmokeVFX"
            capacity={2000}
            layers-mask={bitmask(Layers.TransparentFX)}
        >
            <planeGeometry/>

            <Composable.MeshStandardMaterial transparent depthWrite={false}>
                <Modules.Billboard/>
                <Modules.Scale scale={rng(5)}/>
                <Modules.Velocity direction={direction} time={lifetime.age}/>
                <Modules.Lifetime {...lifetime} />
                <Modules.Texture texture={texture}/>
                <Modules.Alpha
                    alpha={(a) => Mul(a, Smoothstep(1, 0.5, lifetime.progress))}
                />
            </Composable.MeshStandardMaterial>

            <Emitter rate={20} />

            <ECS.ArchetypeEntities archetype="smoke">
                {({smoke}) => smoke}
            </ECS.ArchetypeEntities>
        </InstancedParticles>
    )
}

export const spawnSmokeVFX = (props: EmitterProps) =>
    ECS.world.createEntity({
        // age: 0,
        // destroyAfter: 5,
        smoke: (
            <Emitter
                {...props}
                rate={Infinity}
                limit={between(10, 30)}
                // setup={({mesh}) => {
                //     lifetime.write(mesh, between(0.5, 2), upTo(0.3))
                // }}
            />
        )
    })
