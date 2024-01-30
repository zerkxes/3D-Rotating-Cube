"use strict";
const FACES = [
    // Bottom
    [
        { x: -0.5, y: 0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: -0.5, y: 0.5, z: 0.5 },
    ],
    // Top
    [
        { x: -0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: 0.5 },
        { x: -0.5, y: -0.5, z: 0.5 },
    ],
    // Front
    [
        { x: -0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: -0.5, y: 0.5, z: 0.5 },
    ],
    // Back
    [
        { x: -0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: -0.5 },
        { x: -0.5, y: 0.5, z: -0.5 },
    ],
];
const WIDTH = 1000;
const HEIGHT = 1000;
const CUBE_DIST = 10;
const FOV = 45;
const STROKE_WIDTH = 1;
const c = document.createElement("canvas");
c.width = WIDTH;
c.height = HEIGHT;

const ctx = c.getContext("2d");
ctx.lineWidth = STROKE_WIDTH;
document.body.append(c);


function transform3DTo2D(xy, z) {
    const angleRadians = (FOV / 180) * Math.PI;
    return xy / (z * Math.tan(angleRadians / 2));
}


function draw(mouseX, mouseY) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const mouseXRatio = (mouseX / WIDTH) * Math.PI;
    const mouseYRatio = (mouseY / HEIGHT) * Math.PI;
    const faces2D = FACES.map((points) => points
        .map((p) => rotate3D(p, mouseYRatio, mouseXRatio, 0))
        .map(({ x, y, z }) => ({ x: x, y: y, z: z + CUBE_DIST }))
        .map(({ x, y, z }) => ({
        x: transform3DTo2D(x, z),
        y: transform3DTo2D(y, z),
    }))
        .map(({ x, y }) => ({
        x: x * WIDTH + WIDTH / 2,
        y: y * HEIGHT + HEIGHT / 2,
    })));
    for (const face of faces2D) {
        drawPolygon(ctx, face);
    }
}


c.addEventListener("mousemove", (event) => draw(event.offsetX, event.offsetY));
draw(0, 0);


function drawPolygon(ctx, points) {
    ctx.beginPath();
    for (const { x, y } of points) {
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
}


// https://en.wikipedia.org/wiki/Rotation_matrix#General_rotations
function rotate3D({ x, y, z }, 
/* around x */ roll, // y
/* around y */ pitch, // B
/* around z */ yaw // a
) {
    /*
    [cos(y)*cos(p), cos(y)*sin(p)*sin(r)-sin(y)*cos(r), cos(y)*sin(p)*cos(r)+sin(y)*sin(r)]
    [sin(y)*cos(p), sin(y)*sin(p)*sin(r)+cos(y)*cos(r), sin(y)*sin(p)*cos(r)-cos(y)*sin(r)]
    [   -sin(p),               cos(p)*sin(r),                     cos(p)*cos(r)           ]
   */
    return {
        x: Math.cos(yaw) * Math.cos(pitch) * x +
            (Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll) -
                Math.sin(yaw) * Math.cos(roll)) *
                y +
            (Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll) +
                Math.sin(yaw) * Math.sin(roll)) *
                z,
        y: Math.sin(yaw) * Math.cos(pitch) * x +
            (Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll) +
                Math.cos(yaw) * Math.cos(roll)) *
                y +
            (Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll) -
                Math.cos(yaw) * Math.sin(roll)) *
                z,
        z: -Math.sin(pitch) * x +
            Math.cos(pitch) * Math.sin(roll) * y +
            Math.cos(pitch) * Math.cos(roll) * z,
    };
}
