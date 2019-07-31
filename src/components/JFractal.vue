<template>
    <div class="fractal-container">
        <canvas class="fractal-canvas" @click="onMousePressed" ref="canvas" :width="canvasWidth" :height="canvasHeight" ></canvas>
        <canvas class="small-fractal-canvas" ref="smallCanvas" :width="smallCanvasWidth" :height="smallCanvasHeight"></canvas>

    </div>
</template>

<script>
    import * as FRACTAL from '@/js/fractal';
    export default {
        name: "JFractal",
        data() {
            return {
                canvasWidth: 100,
                canvasHeight: 100,
                smallCanvasWidth: 20,
                smallCanvasHeight: 20,
                fractalGenerator: null
            };
        },
        computed: {
            canvas() { return this.$refs.canvas; },
            smallCanvas() { return this.$refs.smallCanvas; }

        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            handleResize() {
                this.canvasWidth = window.innerWidth;
                this.canvasHeight = window.innerHeight /* * 0.5*/;
                this.smallCanvasWidth = window.innerWidth * 0.2;
                this.smallCanvasHeight = window.innerHeight * 0.2;
            },
            onMousePressed(event) {
                this.fractalGenerator.onMousePressed(event);
            }
        },
        mounted() {


            window.addEventListener('resize', this.handleResize);

            this.handleResize();
            this.$nextTick(() => {
                this.fractalGenerator = new FRACTAL.FractalGenerator(this.canvas, this.smallCanvas);
            });




            // const context = canvas.getContext('2d');
            // context.strokeStyle = '#fff';

            // context.lineWidth = 20;
            //
            // var depth = 9;
            // const initialLength = 20;
            //
            // function drawLine(x1, y1, x2, y2){
            //     context.moveTo(x1, y1);
            //     context.lineTo(x2, y2);
            // }
            //
            // function drawTree(x1, y1, angle, depth){
            //     if (depth !== 0){
            //         var x2 = x1 + (Math.cos(angle) * depth * initialLength);
            //         var y2 = y1 + (Math.sin(angle) * depth * initialLength);
            //         drawLine(x1, y1, x2, y2, depth);
            //         drawTree(x2, y2, angle - 0.3, depth - 1);
            //         drawTree(x2, y2, angle + 0.3, depth - 1);
            //     }
            // }
            //
            // context.beginPath();
            // drawTree(0, 300, 0, depth);
            // context.closePath();
            // context.stroke();

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
    }
</script>

<style scoped>

    .fractal-container {
        position: fixed;
        width: 100%;
        /*height: 50%;*/
        height: 100%;
        /*z-index: -1;*/

    }

    .fractal-canvas {
        /*background-color: #444;*/
        position: fixed;
        width: 100%;
        /*height: 50%;*/
        height: 100%;
        z-index: -1;
    }

    .small-fractal-canvas {
        /*background-color: transparent;*/
        position: fixed;
        width: 20%;
        height: 20%;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
    }

</style>