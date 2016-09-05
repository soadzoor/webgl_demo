document.getElementById("game-surface").addEventListener('contextmenu', function(evt) { 
  evt.preventDefault();
}, false);


function InitDemo () {
	loadTextResource('shader.vert', function(vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('shader.frag', function(fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting vertex shader (see console)');
					console.error(fsErr);
				} else {
					RunDemo(vsText, fsText);
				}
			});
		}
	});
};
var gl;
function RunDemo(vertexShaderText, fragmentShaderText) {
	
	var canvas = document.getElementById('game-surface');
	gl = canvas.getContext('webgl');
	
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl...');
		gl = canvas.getContext('experimental-webgl');
	}
	
	if (!gl) {
		alert('Your browser does not support WegGL!');
	}
	
	/*canvas.width = windows.innerWidth;
	canvas.height = windows.innerHeight;
	gl.viewport(0, 0, window.innerWidth, windows.innerHeight);*/
	
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	//
	// Create shaders
	//
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//
	// buffer
	//
	var triangleVertices =
	[ // X, Y, Z           R, G, B           Normal
		// Top                               
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,    0.0, 1.0, 0.0,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,    0.0, 1.0, 0.0,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,    0.0, 1.0, 0.0,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,    0.0, 1.0, 0.0,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,  -1.0, 0.0, 0.0,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,  -1.0, 0.0, 0.0,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,  -1.0, 0.0, 0.0,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,  -1.0, 0.0, 0.0,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,   1.0, 0.0, 0.0,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,   1.0, 0.0, 0.0,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,   1.0, 0.0, 0.0,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,   1.0, 0.0, 0.0,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,     0.0, 0.0, 1.0,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,    0.0, 0.0, 1.0,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,   0.0, 0.0, 1.0,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,    0.0, 0.0, 1.0,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,    0.0, 0.0, -1.0,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,   0.0, 0.0, -1.0,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,  0.0, 0.0, -1.0,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,   0.0, 0.0, -1.0,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,    0.0, -1.0, 0.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,    0.0, -1.0, 0.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,    0.0, -1.0, 0.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,    0.0, -1.0, 0.0,
		
		// Plane
		-25.0, -15.0, -25.0,   0.5, 0.5, 0.0,    0.0, 1.0, 0.0,
		-25.0, -15.0,  25.0,   0.5, 0.5, 0.0,    0.0, 1.0, 0.0,
		 25.0, -15.0,  25.0,   0.5, 0.5, 0.0,    0.0, 1.0, 0.0,
		 25.0, -15.0, -25.0,   0.5, 0.5, 0.0,    0.0, 1.0, 0.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,
		
		//Plane
		24, 25, 26,
		24, 26, 27
	];
	
	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
	
	
	
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation    = gl.getAttribLocation(program, 'vertColor');
	var normalAttribLocation   = gl.getAttribLocation(program, 'vertNormal');
	
	initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation);
	
	gl.enableVertexAttribArray(normalAttribLocation);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	
	gl.useProgram(program);
	
	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation  = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation  = gl.getUniformLocation(program, 'mProj');
	var matNormalUniformLocation  = gl.getUniformLocation(program, 'mNormal');
	var camPosUniformLocation   = gl.getUniformLocation(program, 'camPos');
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix  = new Float32Array(16);
	var projMatrix  = new Float32Array(16);
	var normalMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	
	var camRight = [1, 0, 0];
	var camUp    = [0, 1, 0];
	var camAt    = [0, 0, 0];
	var camPos   = [0, 0, 35];
	var camFw    = [0, 0, 0];
	var camDist  = vec3.dist(camAt, camPos);
	
	var u = -Math.PI/2;
	var v =  Math.PI/2;

	camFw = getSphereUV(u, v);
	
	mat4.lookAt(viewMatrix, camPos, camAt, camUp);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
	
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation,  gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation,  gl.FALSE, projMatrix);

	mat4.mul(normalMatrix, viewMatrix, worldMatrix);
	mat4.invert(normalMatrix, normalMatrix);
	mat4.transpose(normalMatrix, normalMatrix);
	gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
	
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	
	
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	
	var scaleMatrix = new Float32Array(16);
	mat4.scale(scaleMatrix, identityMatrix, [2, 2, 2]);
	
	var boxes = [];
	var tori = [];
	var spheres = [];
	var cylinders = [];
	var bullets = [];
	var bulletDirs = [];
	var bulletStartTimes = [];
	
	
	var isDDown = false;
	var isADown = false;
	var isSDown = false;
	var isWDown = false;
	var isMouseActive = false;
	
	window.onkeydown = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
		var selection = document.getElementById('geometries').value;
		switch(key) {
			case 68:
				isDDown = true;
				break;
			case 65:
				isADown = true;
				break;
			case 83:
				isSDown = true;
				break;
			case 87:
				isWDown = true;
				break;
			case 32:
				switch(selection) {
					case "Box":
						makeGeometry(camPos, camFw, identityMatrix, boxes);
						break;
					case "Sphere":
						makeGeometry(camPos, camFw, identityMatrix, spheres);
						break;
					case "Torus":
						makeGeometry(camPos, camFw, identityMatrix, tori);
						break;
					case "Cylinder":
						makeGeometry(camPos, camFw, identityMatrix, cylinders);
						break;
				}
				break;
			case 82:
				shoot(camPos, camFw, identityMatrix, bullets, bulletDirs, bulletStartTimes);
				break;
		}
	}
	
	window.onkeyup = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
	    switch(key) {
			case 68:
				isDDown = false;
				break;
			case 65:
				isADown = false;
				break;
			case 83:
				isSDown = false;
				break;
			case 87:
				isWDown = false;
				break;
		}
	}
	
	canvas.onmousedown = function (e) {
		isMouseActive = true;
	}
	
	window.onmouseup = function (e) {
		isMouseActive = false;
		prevX = 0;
		prevY = 0;
		document.getElementById('game-surface').style.cursor = "default";
	}
	
	var prevX = 0;
	var prevY = 0;
	window.onmousemove = function (e) {
		if (isMouseActive) {
			if (prevX < 1 | prevY < 1) {
				prevX = e.clientX;
				prevY = e.clientY;
			}
			u += (e.clientX-prevX) / 200;
			v += (e.clientY-prevY) / 200;
			v = clamp(v, 0.01, 3.14);
			camFw = getSphereUV(u, v);
			vec3.add(camAt, camPos, camFw);
			vec3.cross(camRight, camFw, camUp);
			vec3.normalize(camRight, camRight);
			prevX = e.clientX;
			prevY = e.clientY;
			document.getElementById('game-surface').style.cursor = "none";
		}
	}
	
	window.onresize = function (e) {
		resize(projMatrix, matProjUniformLocation, canvas);
	}
	
	//
	// Parametric
	//
	
	//
	// Sphere
	//
	var sphereVert = [];
	var sphereIndices = [];
	var sphereVertexBufferObject = gl.createBuffer();
	var sphereIndicesBufferObject = gl.createBuffer();
	
	initParametricSphere(sphereVert, sphereIndices, sphereVertexBufferObject, sphereIndicesBufferObject);
	
	//
	// Torus
	//
	var torusVert = [];
	var torusIndices = [];
	var torusVertexBufferObject = gl.createBuffer();
	var torusIndicesBufferObject = gl.createBuffer();
	
	initParametricTorus(torusVert, torusIndices, torusVertexBufferObject, torusIndicesBufferObject);
	
	//
	// Cylinder
	//
	
	var cylinderVert = [];
	var cylinderIndices = [];
	var cylinderVertexBufferObject = gl.createBuffer();
	var cylinderIndicesBufferObject = gl.createBuffer();
	
	initParametricCylinder(cylinderVert, cylinderIndices, cylinderVertexBufferObject, cylinderIndicesBufferObject);
	
	//
	// Parametric end
	//
	
	var tempMatrix = new Float32Array(16);
	var tempMatrix2 = new Float32Array(16);
	var tempMatrix3 = new Float32Array(16);
	var tempMatrix4 = new Float32Array(16);
	var tempMatrix5 = new Float32Array(16);
	var tempMatrix6 = new Float32Array(16);
	
	var ve = vec3.fromValues(10, 10, 10);
	mat4.translate(tempMatrix6, identityMatrix, ve);
	
	//
	// Main render loop
	//
	var loop = function () {
		var camSpeed = (document.getElementById('camera-speed-range').value/100 + 0.05)/1.05;
		if (isDDown) {
			var right = [0, 0, 0];
			vec3.scale(right, camRight, camSpeed);
			vec3.add(camPos, camPos, right);
			vec3.add(camAt, camAt, right);
		}
		if (isADown) {
			var right = [0, 0, 0];
			vec3.scale(right, camRight, camSpeed);
			vec3.sub(camPos, camPos, right);
			vec3.sub(camAt, camAt, right);
		}
		if (isSDown) {
			var fw = [0, 0, 0];
			vec3.scale(fw, camFw, camSpeed);
			vec3.sub(camPos, camPos, fw);
			vec3.sub(camAt, camAt, fw);
		}
		if (isWDown) {
			var fw = [0, 0, 0];
			vec3.scale(fw, camFw, camSpeed);
			vec3.add(camPos, camPos, fw);
			vec3.add(camAt, camAt, fw);
		}
		
		mat4.lookAt(viewMatrix, camPos, camAt, camUp);
		gl.uniform3fv(camPosUniformLocation, camPos);
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
		
		angle = performance.now() / 1000.0 / 6 * 2 * Math.PI;
		
		
		gl.clearColor(0.75, 0.85, 1.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		
		//
		// spheres
		//
		
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBufferObject);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndicesBufferObject);
		initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation);
		
		mat4.invert(normalMatrix, scaleMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
		
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, scaleMatrix);
		gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);
		
		for (var i = 0; i < spheres.length; ++i) {
			mat4.invert(normalMatrix, spheres[i]);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, spheres[i]);
			gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);
		}
		
		mat4.invert(normalMatrix, scaleMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
		
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, scaleMatrix);
		gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);
		
		
		var ballSpeed = (document.getElementById('ball-speed-range').value/100+0.1)/1.1;
		
		for (var i = 0; i < bullets.length; ++i) {
			var vec = [0, 0, 0];
			var elapsedTime = performance.now() - bulletStartTimes[i];
			
			if (elapsedTime*ballSpeed > 2000) {
				bullets.splice(i, 1);
				bulletDirs.splice(i, 1);
				bulletStartTimes.splice(i, 1);
			} else {
				//vec3.scale(vec, bulletDirs[i], ballSpeed*elapsedTime/50);
				//vec3.scale(bulletDirs[i], bulletDirs[i], ballSpeed);
				vec3.add(vec, vec, bulletDirs[i]);
				vec3.scale(vec, vec, ballSpeed*5);
				mat4.translate(bullets[i], bullets[i], vec);
				mat4.invert(normalMatrix, bullets[i]);
				mat4.transpose(normalMatrix, normalMatrix);
				gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
				gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, bullets[i]);
				gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);
				
				hitObjects(bullets[i], boxes);
				hitObjects(bullets[i], spheres);
				hitObjects(bullets[i], tori);
				hitObjects(bullets[i], cylinders);
				//for (var j = 0; j < boxes.length; ++j) {
				//	if (Math.abs(bullets[i][12]-boxes[j][12]) < Math.PI && Math.abs(bullets[i][13]-boxes[j][13]) < Math.PI && Math.abs(bullets[i][14]-boxes[j][14]) < Math.PI) {
				//		boxes.splice(j, 1);
				//	}
				//}
			}
		}
		//
		// cylinders
		//
		
		gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexBufferObject);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndicesBufferObject);
		initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation);
		
		for (var i = 0; i < cylinders.length; ++i) {
			mat4.invert(normalMatrix, cylinders[i]);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, cylinders[i]);
			gl.drawElements(gl.TRIANGLES, cylinderIndices.length, gl.UNSIGNED_SHORT, 0);
		}
		
		//
		// tori
		//
		
		gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torusIndicesBufferObject);
		initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation);
		
		for (var i = 0; i < tori.length; ++i) {
			mat4.invert(normalMatrix, tori[i]);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, tori[i]);
			gl.drawElements(gl.TRIANGLES, torusIndices.length, gl.UNSIGNED_SHORT, 0);
		}
		
		//
		// boxes
		//
		
		gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation);
		
		//mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		//mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		//mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
		//
		//mat4.invert(normalMatrix, worldMatrix);
		//mat4.transpose(normalMatrix, normalMatrix);
		//gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
		//gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		//gl.drawElements(gl.TRIANGLES, boxIndices.length-6, gl.UNSIGNED_SHORT, 0);
		
		
		mat4.translate(tempMatrix, identityMatrix, [10, 0, 0]);
		mat4.rotate(tempMatrix3, identityMatrix, angle*3, [0, 1, 0]);
		mat4.rotate(tempMatrix4, identityMatrix, angle/4, [0, 0, 1]);
		mat4.rotate(tempMatrix5, identityMatrix, angle*1.5, [1, 1, 1]);
		
		for (var i = 0; i < 10; ++i) {
			mat4.rotate(tempMatrix2, identityMatrix, (i/10)*2*Math.PI, [0, 1, 0]);
			mat4.mul(worldMatrix, tempMatrix2, tempMatrix);
			mat4.mul(worldMatrix, tempMatrix3, worldMatrix);
			mat4.mul(worldMatrix, tempMatrix4, worldMatrix);
			mat4.mul(worldMatrix, tempMatrix5, worldMatrix);
			
			mat4.invert(normalMatrix, worldMatrix);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
			gl.drawElements(gl.TRIANGLES, boxIndices.length-6, gl.UNSIGNED_SHORT, 0);
		}
		
		for (var i = 0; i < boxes.length; ++i) {
			mat4.invert(normalMatrix, boxes[i]);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, boxes[i]);
			gl.drawElements(gl.TRIANGLES, boxIndices.length-6, gl.UNSIGNED_SHORT, 0);
		}
		//
		// plane
		//
		mat4.invert(normalMatrix, identityMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(matNormalUniformLocation, gl.FALSE, normalMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, identityMatrix);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, (boxIndices.length-6)*Uint16Array.BYTES_PER_ELEMENT);
		
		
		
		
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
};





function loadTextResource(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
	request.onload = function () {
		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
		} else {
			callback(null, request.responseText);
		}
	};
	request.send();
};

function clamp(num, min, max) {
	if (num < min) {
		return min;
	}
	if (num > max) {
		return max;
	}
	return num;
}


function makeGeometry(camPos, camFw, worldMatrix, array) {
	var out  = new Float32Array(16);
	var vec  = [0, 0, 0];
	var vec2 = [0, 0, 0];
	vec3.scale(vec2, camFw, 5);
	vec3.add(vec2, camFw, vec2);
	vec3.add(vec, camPos, vec2);
	
	mat4.translate(out, worldMatrix, vec);
	array.push(out);
}

function shoot(camPos, camFw, worldMatrix, bullets, bulletDirs, bulletStartTimes) {
	var out  = new Float32Array(16);
	var vec  = [0, 0, 0];
	var vec2 = [0, 0, 0];
	vec3.scale(vec2, camFw, 5);
	vec3.add(vec2, camFw, vec2);
	vec3.add(vec, camPos, vec2);
	
	mat4.translate(out, worldMatrix, vec);
	bullets.push(out);
	
	bulletDirs.push(camFw);
	
	bulletStartTimes.push(performance.now());
}

function getSphereUV(u, v) {
	var uv = [0, 0, 0];
	vec3.normalize(uv, vec3.fromValues(Math.cos(u) * Math.sin(v), Math.cos(v), Math.sin(u)*Math.sin(v)));
	return uv;
}

function getTorusUV(u, v, R, r) { //R->Torus' range from its center. r->radius of its cross-section
	var uv = [0, 0, 0];
	uv = vec3.fromValues((R+r*Math.cos(v))*Math.cos(u), r*Math.sin(v), (R+r*Math.cos(v))*Math.sin(u));
	return uv;
}

function getCylinderUV(u, v) {
	var uv = [0, 0, 0];
	uv = vec3.fromValues(Math.cos(u), Math.sin(u), v);
	return uv;
}



function initAttribPointer(positionAttribLocation, colorAttribLocation, normalAttribLocation) {
	//Vertices of triangles
	gl.vertexAttribPointer(
		positionAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE, // is it normalized
		9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0// Offset from the beginning of a single vertex to this attribute
	);
	//Colors of trianglevertices
	gl.vertexAttribPointer(
		colorAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE, // is it normalized
		9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
	);
	//Normals of trianglevertices
	gl.vertexAttribPointer(
		normalAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.TRUE, // is it normalized
		9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
}

function initParametricSphere(sphereVert, sphereIndices, sphereVertexBufferObject, sphereIndicesBufferObject) {
	var N = 50;
	var M = 50;
	
	
	for (var i = 0; i <= N; ++i) {
		for (var j = 0; j <= M; ++j) {
			var uu = i/N * Math.PI * 2;
			var vv = j/M * Math.PI * 2;
			var pos = [];
			pos = getSphereUV(uu, vv);
			
			var norm = [];
			vec3.normalize(norm, pos);
			
			sphereVert.push(pos[0], pos[1], pos[2]);
			sphereVert.push(0.6, 0.0, 0.0);
			sphereVert.push(norm[0], norm[1], norm[2]);

			
		}
	}
	
	for (var i = 0; i < N; ++i) {
		for (var j = 0; j < M; ++j) {
			sphereIndices.push((i)	 + (j)*	(N+1));
			sphereIndices.push((i+1) + (j)*	(N+1));
			sphereIndices.push((i)	 + (j+1)*(N+1));
			sphereIndices.push((i+1) + (j)*	(N+1));
			sphereIndices.push((i+1) + (j+1)*(N+1));
			sphereIndices.push((i)	 + (j+1)*(N+1));
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVert), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndicesBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
}

function initParametricTorus(torusVert, torusIndices, torusVertexBufferObject, torusIndicesBufferObject) {
	var N = 50;
	var M = 50;
	
	
	var R = 2;
	var r = 0.6;
	
	for (var i = 0; i <= N; ++i) {
		for (var j = 0; j <= M; ++j) {
			var uu = i/N * Math.PI * 2;
			var vv = j/M * Math.PI * 2;
			var pos = [];
			pos = getTorusUV(uu, vv, R, r);
			var norm = [];
			norm = getTorusUV(uu, vv, 0, r);
			
			vec3.normalize(norm, norm);
			
			torusVert.push(pos[0], pos[1], pos[2]);
			torusVert.push(0.0, 0.6, 0.0);
			torusVert.push(norm[0], norm[1], norm[2]);

			
		}
	}
	
	for (var i = 0; i < N; ++i) {
		for (var j = 0; j < M; ++j) {
			torusIndices.push((i)	 + (j)*	(N+1));
			torusIndices.push((i+1) + (j)*	(N+1));
			torusIndices.push((i)	 + (j+1)*(N+1));
			torusIndices.push((i+1) + (j)*	(N+1));
			torusIndices.push((i+1) + (j+1)*(N+1));
			torusIndices.push((i)	 + (j+1)*(N+1));
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusVert), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torusIndicesBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torusIndices), gl.STATIC_DRAW);
}

function initParametricCylinder(cylinderVert, cylinderIndices, cylinderVertexBufferObject, cylinderIndicesBufferObject) {
	var N = 50;
	var M = 50;
	
	
	var r = 2;
	var h = 4;
	
	var topCenter = [0, h, 0];
	var bottomCenter = [0, 0, 0];
	
	for (var i = 0; i < M; ++i) {
		var uu = i/M * Math.PI * 2;
		var vv = (i+1)/M * Math.PI * 2;

		var norm = [];

		norm = [0, 1, 0];
		vec3.normalize(norm, norm);
		
		//top of cylinder
		cylinderVert.push(topCenter);
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		cylinderVert.push((r*Math.cos(vv), h, r*Math.sin(vv)));
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);

		cylinderVert.push((r*Math.cos(uu), h, r*Math.sin(uu)));
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		//bottom of cylinder
		norm = [0, -1, 0];
		vec3.normalize(norm, norm);
		cylinderVert.push(bottomCenter);
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		cylinderVert.push((r*Math.cos(vv), 0, r*Math.sin(vv)));
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);

		cylinderVert.push((r*Math.cos(uu), 0, r*Math.sin(uu)));
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		//
		var x = Math.cos(uu) * r;
		var z = Math.sin(uu) * r;
		cylinderVert.push(x, 0, z);
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		cylinderVert.push(x, h, z);
		cylinderVert.push(0.0, 0.0, 0.6);
		cylinderVert.push(norm[0], norm[1], norm[2]);
		
		
		

		
	}
	
	for (var j = 0; j < 8*M; ++j) {
		cylinderIndices.push(j);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVert), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndicesBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
}

function hitObjects(bullet, array) {
	for (var j = 0; j < array.length; ++j) {
		if (Math.abs(bullet[12]-array[j][12]) < Math.PI && Math.abs(bullet[13]-array[j][13]) < Math.PI && Math.abs(bullet[14]-array[j][14]) < Math.PI) {
			array.splice(j, 1);
		}
	}
}

function resize(projMatrix, matProjUniformLocation, canvas) {
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
	gl.uniformMatrix4fv(matProjUniformLocation,  gl.FALSE, projMatrix);
}