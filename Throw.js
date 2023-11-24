AFRAME.registerComponent("bowling-balls",{
    init : function (){
        this.throwBall();
    },

    throwBall : function () {
        window.addEventListener("keydown",(e)=>{
            if (e.key === "z") {
                var ball = document.createElement("a-entity");
                ball.setAttribute("gltf-model","./assets/bowling-ball/scene.gltf");
                ball.setAttribute("scale",{x:3, y:3, z:3});
                var cam = document.querySelector("#camera");
                pos = cam.getAttribute("position");
                ball.setAttribute("position",{
                    x: pos.x,
                    y: pos.y-0.75,
                    z: pos.z,
                });

                var camera = document.querySelector("#camera").object3D;
                var direction = new THREE.Vector3();
                camera.getWorldDirection(direction);
            
                ball.setAttribute("velocity",direction.multiplyScalar(-10));
                var scene = document.querySelector("#scene");

                ball.setAttribute("dynamic-body",{shape:"sphere", mass:"0",})

                ball.addEventListener("collide",this.removeBall)

                scene.appendChild(ball);
            }
        });
    },

    removeBall: function (e) {
        // ball element
        console.log(e.detail.target.el);

        // collided entity
        console.log(e.detail.body.el);

        // variables
        var element = e.detail.target.el;
        var elementHit = e.detail.body.el;

        if (elementHit.includes("pin")) {
            // impulse to the pins
            var impulse = new CANNON.Vec3(0, 1, -1);
            var worldPoint = new CANNON.Vec3().copy(elementHit.getAttribute("position"));
            elementHit.body.applyImpulse(impulse, worldPoint);

            // adding collide event
            elementHit.removeEventListener("collide",this.remove);

            // removing the ball from scene
            var scene = document.querySelector("#scene");
            scene.removechild(element);
        }
    }
    
});