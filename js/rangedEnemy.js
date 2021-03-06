Crafty.c('REnemy', {
	init: function() {
		this.requires('2D, DOM, REnemy, Collision, Solid, Motion, Color, enemySprite')
//			.color('#e0e0e0')
			.attr({w:30, h: 30})
			.stopOnSolids()
			.hitByAttack()
			.stopOnHoles()
			.rEnemyMovement()
			.rEnemyAttackLoop()

		this.hp = 2;
	},
	stopOnSolids: function() {
        this.onHit('Solid', this.stopMovement);
        return this;
    },
    stopOnHoles: function() {
        this.onHit('Hole', this.stopMovement);
        return this;
    },
    stopMovement: function(hit_vals) {
        this.x -= this.dx;
        this.y -= this.dy;
    },
    hitByAttack: function() {
    	this.checkHits('PAttack')
        .bind('HitOn', function() {
            console.log("hit!")
            this.hp--;
            console.log("remaining hp", this.hp)
            if (this.hp <= 0) {
                this.destroy();
            }
        })
        return this;
    },
    rEnemyMovement: function() {
    	var rEnemy = this
    	rEnemy.velocity().x = 1

    	rEnemy.bind('Moved', function(movement) {
	    	if (Math.abs(rEnemy.x - Crafty('PlayerCharacter').x) < 50) {
	    		if (rEnemy.x > Crafty('PlayerCharacter').x) {
	    			rEnemy.velocity().x = 75
	    		}
	    		else {
	    			rEnemy.velocity().x = -75
	    		}
	    	}
	    	if (Math.abs(rEnemy.y - Crafty('PlayerCharacter').y)) {
	    		if (rEnemy.x > Crafty('PlayerCharacter').y) {
	    			rEnemy.velocity().y = 75
	    		}
	    		else {
	    			rEnemy.velocity().y = -75
	    		}
	    	}
    	})
    	return this;
    },
    rEnemyAttackLoop: function() {
    	var rEnemy = this
    	var player = Crafty('PlayerCharacter')

    	this._attackInterval = setInterval(function() {
    		rEnemy.velocity().x = 0
    		rEnemy.velocity().y = 0

    		setTimeout(function() { 
    			rEnemy.rEnemyAttack();
    			setTimeout(function() {
    				rEnemy.velocity().x = 1
    			}, 250) 
    		}, 250);

    	}, 1000)
        this.bind("Remove", function() {
            clearInterval(this._attackInterval)
            console.log("Interval Removed")
        });
    	return this;
    },
    rEnemyAttack: function() {
    	var rEnemy = this
    	var player = Crafty('PlayerCharacter')

    	var dx = player.x - rEnemy.x
    	var dy = player.y - rEnemy.y
    	var dist = Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), .5)
    	var multiplier = 100/dist

    	var projectile = Crafty.e('Projectile')
    	projectile.attr({x:rEnemy.x + 15, y:rEnemy.y + 15})
    	projectile.rotation = Math.atan(dy/dx) * 180/Math.PI
    	projectile.velocity().x = dx*multiplier
    	projectile.velocity().y = dy*multiplier
    	return this;
    }
})