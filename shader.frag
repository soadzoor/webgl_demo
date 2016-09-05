precision mediump float;

varying vec3 fragPosition;
varying vec3 fragColor;
varying vec3 fragNormal;

uniform vec3 camPos;

vec3 ambient;
vec3 diffuse;
vec3 specular;
vec3 lightPos = vec3(13, 13, 13);
float specPow = 10.0;



void main()
{
	vec3 normal = normalize(fragNormal);
	ambient = 0.4*fragColor;
	diffuse = fragColor;
	specular = vec3(0.0, 0.0, 0.0);
	
	vec3 toLight = normalize(lightPos - fragPosition);
	float di = max(dot(toLight, normal), 0.0);
	diffuse *= di;
	clamp(diffuse, 0.0, 1.0);
	
	//vec3 e = normalize(camPos-fragPosition);
	//vec3 r = reflect(-toLight, normal);
	//float si = pow(max(dot(e, r), 0.0), specPow);
	//specular = vec3(0.6, 0.6, 0.6)*si;
	//clamp(specular, 0.0, 1.0);
	
	vec3 e = normalize(camPos-fragPosition);
	vec3 h = normalize(e+toLight);
	float si = pow(max(dot(h, normal), 0.0), specPow);	
	specular = (di+1.0)/2.0 * vec3(0.6, 0.6, 0.6)*si;
	clamp(specular, 0.0, 1.0);

	
	
	
	gl_FragColor = vec4(ambient+diffuse+specular, 1.0);
	
	
}