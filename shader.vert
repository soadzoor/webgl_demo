precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec3 vertNormal;

varying vec3 fragPosition;
varying vec3 fragColor;
varying vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mNormal;

void main()
{
	fragColor = vertColor;
	fragNormal = (mNormal * vec4(vertNormal, 0)).xyz;
	//fragNormal = (mWorld * vec4(vertNormal, 0)).xyz;
	fragPosition = (mWorld * vec4(vertPosition, 1)).xyz;
	
	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}