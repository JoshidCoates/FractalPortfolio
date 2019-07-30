import * as THREE from 'three';
import { TimelineMax, Expo } from "gsap";

export class FractalGenerator {

    constructor(canvas) {
        this.canvas = canvas;
        this.init();
        this.generateFractal();
    }

    init() {

        this.pages = ["Home", "About", "Portfolio", "Contact"];

        this.currentWidth = this.canvas.width;
        this.currentHeight = this.canvas.height;

        // Renderer and scene
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
        this.renderer.setSize(this.currentWidth, this.currentHeight, false);
        this.scene = new THREE.Scene();

        // Camera
        const fov = 75;
        const aspect = this.currentWidth / this.currentHeight;
        const near = 0.1;
        const far = 100; // todo tweak for performance
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(8, 0, 8); // 2, 0, 4
        this.camera.rotation.set(0, 0, 0, "ZYX"); // 0, -0.6, 0

        // Light
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.AmbientLight(color, intensity);
            this.scene.add(light);
        }


        const boxWidth = 1;
        const boxHeight = 0.8;
        const boxDepth = 0.6;
        this.geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const boxColours = [0x888888, 0xcccccc, 0x999999, 0xaaaaaa, 0xeeeeee, 0x000000];

        for (let i = 0; i < boxColours.length; i++) {
            this.geometry.faces[i * 2].color.setHex(boxColours[i]);
            this.geometry.faces[i * 2 + 1].color.setHex(boxColours[i]);
        }

        this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, vertexColors: THREE.FaceColors});
        this.textMaterial = new THREE.MeshBasicMaterial({color: 0x000000});


        this.pageTitles = [];
        const loader = new THREE.FontLoader();

        const self = this;

        loader.load( 'http://localhost:8080/static/public/title_font.json', (font) => {

            self.pages.forEach((page) => {

                self.pageTitles.push(
                    new THREE.TextGeometry( page, {
                        font: font,
                        size: 80,
                        height: 1,
                        curveSegments: 12,
                        bevelEnabled: false
                    })
                );

            });



        });

        this.lineLength = 16;
        this.lines = [];
        this.currentDirections = [0];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // this.Line = class Line {
        //     constructor(directions, x, y, angle) {
        //         this._directions = directions;
        //         this._x = x;
        //         this._y = y;
        //         this._angle = angle;
        //     }
        //
        //     get directions() {
        //         return this._directions;
        //     }
        //
        //     get x() {
        //         return this._x;
        //     }
        //
        //     get y() {
        //         return this._y;
        //     }
        //
        //     get angle() {
        //         return this._angle;
        //     }
        // }

    }

    generateFractal() {

        this.drawTree(0, 0, 0, [], 0, 2);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => { this.render() });

    }

    makeBox(x, y, z, length, angle) {

        const box = new THREE.Mesh(this.geometry, this.material);


        this.scene.add(box);

        box.position.set(x, y, z);


        box.rotation.z = angle;
        box.scale.x = length;


        const yDiff = (this.pages.length + 1) * 0.5;
        const xDiff = 4;
        const arrowSlant = 0.8;
        const arrowDisplace = 0.2;
        const arrowLength = 0.06;
        const arrowHeight = 0.5;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const arrowBox1 = new THREE.Mesh(this.geometry, this.material);
        arrowBox1.position.set(x - xDiff * cos - (yDiff + arrowDisplace) * sin, y + xDiff * sin + (yDiff + arrowDisplace) * cos, z);
        arrowBox1.rotation.z = angle + arrowSlant;
        arrowBox1.scale.x = length * arrowLength;
        arrowBox1.scale.y = arrowHeight;


        const arrowBox2 = new THREE.Mesh(this.geometry, this.material);
        // const hypo = (this.pages.length + 1) * 0.5;
        arrowBox2.position.set(x - xDiff * cos + (yDiff - arrowDisplace) * sin, y + xDiff * sin + (yDiff - arrowDisplace) * cos, z);
        arrowBox2.rotation.z = angle - 0.8;
        arrowBox2.scale.x = length * 0.06;
        arrowBox2.scale.y = 0.5;

        const arrowBox3 = new THREE.Mesh(this.geometry, this.material);
        // const hypo = (this.pages.length + 1) * 0.5;
        arrowBox3.position.set(x - 3.4 - yDiff * Math.cos((Math.PI / 2) - angle), y + yDiff * Math.sin((Math.PI / 2) - angle), z);
        arrowBox3.rotation.z = angle;
        arrowBox3.scale.x = length * 0.1;
        arrowBox3.scale.y = 0.5;

        const arrow = new THREE.Group();
        arrow.add(arrowBox1);
        arrow.add(arrowBox2);
        arrow.add(arrowBox3);


        this.scene.add(arrow);
        arrow.name = "Arrow";

        this.pages.forEach((page, index) => {


            const button = new THREE.Mesh(this.geometry, this.material);

            this.scene.add(button);

            const hypo = this.pages.length - index;
            button.position.set(x - hypo * Math.cos((Math.PI / 2) - angle), y + hypo * Math.sin((Math.PI / 2) - angle), z);
            button.rotation.z = angle;
            button.scale.x = length * 0.25;

            button.name = page.toString();

            const title = new THREE.Mesh(this.pageTitles[index], this.textMaterial);
            this.scene.add(title);
            title.position.set(x - hypo * Math.cos((Math.PI / 2) - angle), y + hypo * Math.sin((Math.PI / 2) - angle), z + 0.2);
            title.rotation.z = angle;



        });

    }

    addLine(startX, startY, angle, directions){

        const middleX = startX + (Math.cos(angle) * this.lineLength * 0.5);
        const middleY = startY + (Math.sin(angle) * this.lineLength * 0.5);

        this.makeBox(middleX, middleY, 0, this.lineLength, angle);
        this.lines.push({directions: directions, x: middleX, y: middleY, angle: angle});

    }

    drawTree(currentLineStartX, currentLineStartY, angle, previousDirections, page, depth) {
        if (depth !== 0){

            const newDirections = previousDirections.slice(0);
            newDirections.push(page);

            this.addLine(currentLineStartX, currentLineStartY, angle, newDirections);

            depth--;

            const nextLineStartX = currentLineStartX + (Math.cos(angle) * this.lineLength);
            const nextLineStartY = currentLineStartY + (Math.sin(angle) * this.lineLength);

            this.drawTree(nextLineStartX, nextLineStartY, (angle - 1.2), newDirections, 0, depth);
            this.drawTree(nextLineStartX, nextLineStartY, (angle - 0.40), newDirections, 1, depth);
            this.drawTree(nextLineStartX, nextLineStartY, (angle + 0.40), newDirections, 2, depth);
            this.drawTree(nextLineStartX, nextLineStartY, (angle + 1.2), newDirections, 3, depth);

        }
    }

    render() {


        if (this.canvas.width !== this.currentWidth || this.canvas.height !== this.currentHeight) {
            this.currentWidth = this.canvas.width;
            this.currentHeight = this.canvas.height;
            this.renderer.setSize(this.currentWidth, this.currentHeight, false);
            this.camera.aspect = this.currentWidth / this.currentHeight;
            this.camera.updateProjectionMatrix();

        }

        this.renderer.render(this.scene, this.camera);





        requestAnimationFrame(() => { this.render()});
    }

    onMousePressed(event) {

        event.preventDefault();

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; // todo work out what to do here
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            let clickedObject = intersects[0].object; // todo try to move text as well once got text working

            const pageIndex = this.pages.indexOf(clickedObject.name);
            if (pageIndex !== -1 || clickedObject.parent.name === "Arrow") {

                if (pageIndex === -1) {
                    clickedObject = clickedObject.parent;
                }

                this.tl = new TimelineMax();
                this.tl.to(clickedObject.scale, 0.2, {z: 0.4, ease: Expo.easeOut});
                this.tl.to(clickedObject.position, 0.2, {z: -0.2, ease: Expo.easeOut}, "=-0.2");
                this.tl.to(clickedObject.scale, 0.2, {z: 1, ease: Expo.easeOut});
                this.tl.to(clickedObject.position, 0.2, {z: 0, ease: Expo.easeOut}, "=-0.2");

                if (pageIndex !== -1) {
                    this.currentDirections.push(pageIndex);
                } else {
                    this.currentDirections.pop();
                }

                const newMenu = this.lines.find(line => FractalGenerator.arraysEqual(line.directions, this.currentDirections));

                this.tl.to(this.camera.position, 0.8, {x: newMenu.x, y: newMenu.y, ease: Expo.easeOut});
                this.tl.to(this.camera.rotation, 0.8, {z: newMenu.angle, ease: Expo.easeOut}, "=-0.8");


            }

        }


    }

    static arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }





    // const requestAnimationFrame = window.requestAnimationFrame;
    //
    // const cancelAnimation = window.cancelAnimationFrame;
    // let currentAnimationFrame;
    // let radius = 20;
    // let lineLength = 80;
    // const initialDirectionAngle = 180;
    // const inputtedAngle = 16;
    // const displayedLines = [];
    // displayedLines.push( new Line(0,400,initialDirectionAngle) );
    // drawAll();
    //
    //
    // function Line(x,y,angle){
    //     this.x = x;
    //     this.y = y;
    //     this.a = angle;
    //     this.draw = true;
    //     this.len = 0;
    //     this.cx = Math.cos(Math.PI/180*this.a)*3;
    //     this.cy = Math.sin(Math.PI/180*this.a)*3;
    //     this.update = function(){
    //         this.x -= this.cx;
    //         this.y -= this.cy;
    //     }
    // }
    //
    // function draw(){
    //     for(var d1=0; d1<displayedLines.length; d1++){
    //         context.beginPath();
    //         context.arc(displayedLines[d1].x,displayedLines[d1].y,radius,0,Math.PI*2);
    //
    //         context.fill();
    //
    //         displayedLines[d1].len++;
    //         displayedLines[d1].update();
    //     }
    // }
    //
    // function check(){
    //     var d2=0;
    //     while( displayedLines[d2].len >= lineLength ){
    //         displayedLines.push(new Line(displayedLines[d2].x,displayedLines[d2].y,displayedLines[d2].a-inputtedAngle) );
    //         displayedLines.push(new Line(displayedLines[d2].x,displayedLines[d2].y,displayedLines[d2].a+inputtedAngle) );
    //         displayedLines.shift();
    //         if(displayedLines[d2].len == 0){
    //             lineLength -= 3;
    //             if(radius > 1){  radius -= 0.5; }
    //             break;
    //         }
    //     }
    // }
    //
    // function drawAll(){
    //     //  var setInt = setInterval(function(){
    //     if(lineLength < 10){
    //
    //         //  clearInterval(setInt);
    //         cancelAnimation(currentAnimationFrame);
    //         return;
    //     }
    //     draw();
    //     check();
    //     currentAnimationFrame = requestAnimationFrame(drawAll);
    //     // },10)
    // }  // drawAll function


}