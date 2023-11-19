const canvas = document.getElementById('bgeffect')
const ctx = canvas.getContext('2d')
canvas.style.position = "fixed"
canvas.style.left = "0px"
canvas.style.top = "0px"
canvas.style.padding = "0px"
canvas.style.margin = "0px"
var [width, height] = [window.innerWidth, window.innerHeight]
canvas.style.width = `${width}px`
canvas.width = width
canvas.style.height = `${height}px`
canvas.height = height
const bounds = canvas.getBoundingClientRect()

// VARIABLES TO ADJUST THE CONFIGURATION OF THE ANIMATION
const colors = [ '#adffff','#b1f6d6','#c7e7b0','#e2d59a','#f8c09a','#ffadad' ]
const standard_size = bounds.right / 20     // so clouds and animation scale with window width
const number_of_layers = colors.length      // Add more cloud layers by simply adding a new color value to the colors global array at the top
const sway_distance = standard_size / 2
const standard_speed = 0.35

// Using circles drawn side by side in rows to create the cloud effect
class drawCircle {
    constructor(xpos, ypos, radius, color, spd, delay) {
        this.x = xpos
        this.y = ypos
        this.size = standard_size    // used to make sure clouds are positioned and how far they sway back and forth
        this.radius = radius        // size of each drawn cloud drawn
        this.color = color          // color of the layer of clouds
        this.spd = spd              // for the speed of the clouds shuffling
        this.delay = delay          // for a bit of variety in the motion
        this.direction = true
        this._x = xpos  // retain starting value
    }
    // create animation by updating each circle's position before it is drawn
    update(){
        if (this.delay > 0) { this.delay -= 0.01 }
        else {
            // MAKE MOTION
            if (this.direction){
                // true means move right
                this.x += this.spd
            }
            else {
                this.x -= this.spd
            }
            // CHECK FOR DIRECTION CHANGE
            if (this.x > this._x + (this.size / 5)){
                if (this.direction) { this.direction = false} 
            }
            else if(this.x < this._x - (this.size/5)) {
                if (!this.direction) { this.direction = true }
            }
        }
        }
    // draw the object by calling this method for each circle we want to draw
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        let tmpstyle = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = tmpstyle    // preserve existing canvas styles, in case you're doing something else with the canvas so the cloud effect doesn't mess up your color schemes. 
    }
}


const areaHeight = parseInt(bounds.height / 2)

// each element is a group of circles to draw, ie: a layer of clouds to be drawn
let all_layers = []

// create a layer of clouds to be added to all_layers array
const createLayer = (position, color)=>{
    let cursor = 0
    let output_layer = []
    let layery = (areaHeight / number_of_layers) * position
    while(cursor < bounds.right+standard_size){
        let delay = 0
        let newsize = parseInt( (Math.random() * standard_size) + standard_size )
        let layercolor = color
        output_layer.push(new drawCircle(cursor, areaHeight - layery, newsize, layercolor, standard_speed, delay + Math.random()))
        cursor += newsize
    }
    return output_layer
}

// For every color we have in the colors array, create a layer of clouds in that color
colors.forEach( (_v, idx )=>{ all_layers.push(createLayer(idx, colors[idx])) })

// Finally, run a function to draw all our objects on the canvas. At the end of each call it calls itself recursively to keep the animation alive
function render(){
    ctx.clearRect(0,0,bounds.right, bounds.bottom)
    all_layers.forEach( (val)=>{
        val.forEach( v => {
            v.update()
            v.draw()
        } )
    })

    window.requestAnimationFrame(render)
}

// Call the render function once to get the animation started
render()
