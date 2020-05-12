extends KinematicBody2D

var anim_player
var label

export var SPEED = 200
export var JUMP = 275
export var GRAVITY = 1000

var velocity = Vector2()
var facing_right = false

var death_count = 0

# Called when the node enters the scene tree for the first time.
func _ready():
	anim_player =  $AnimatedSprite
	label = get_node("Label")
	
func _physics_process(delta):
	var dir = 0
	
	velocity.y += delta * GRAVITY

	if Input.is_action_pressed("ui_left"):
		dir -=1
		velocity.x = -SPEED
	elif Input.is_action_pressed("ui_right"):
		dir +=1
		velocity.x = SPEED
	else:
		velocity.x = 0

	var onFloor = is_on_floor();
	
	if onFloor and Input.is_action_pressed("ui_up"):
		velocity.y = -JUMP

	if facing_right and dir > 0:
		flipSprite()
	if !facing_right and dir < 0:
		flipSprite()
		
	if onFloor:
		if dir == 0:
			PlayAnim('idle')
		else:
			PlayAnim('run')
	else:
		PlayAnim('jump')
		
	move_and_slide(velocity, Vector2(0, -1))
	
	if position.y >= 500:
		position.x = -55
		position.y = 8
		death_count += 1
		label.set_text(death_count)

func flipSprite():
	facing_right = !facing_right
	anim_player.flip_h = !anim_player.flip_h

func PlayAnim(name):
	if anim_player.is_playing() and anim_player.animation == name:
		return
	anim_player.play(name)
	
