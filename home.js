// glMatrix v0.9.5
glMatrixArrayType=typeof Float32Array!="undefined"?Float32Array:typeof WebGLFloatArray!="undefined"?WebGLFloatArray:Array;var vec3={};vec3.create=function(a){var b=new glMatrixArrayType(3);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2]}return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a==c){a[0]+=b[0];a[1]+=b[1];a[2]+=b[2];return a}c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
vec3.subtract=function(a,b,c){if(!c||a==c){a[0]-=b[0];a[1]-=b[1];a[2]-=b[2];return a}c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a==c){a[0]*=b;a[1]*=b;a[2]*=b;return a}c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g==1){b[0]=c;b[1]=d;b[2]=e;return b}}else{b[0]=0;b[1]=0;b[2]=0;return b}g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1];a=a[2];var g=b[0],f=b[1];b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1];a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1];a=a[2]-b[2];b=Math.sqrt(d*d+e*e+a*a);if(!b){c[0]=0;c[1]=0;c[2]=0;return c}b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var mat3={};
mat3.create=function(a){var b=new glMatrixArrayType(9);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9]}return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=0;b[4]=a[3];b[5]=a[4];b[6]=a[5];b[7]=0;b[8]=a[6];b[9]=a[7];b[10]=a[8];b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};var mat4={};mat4.create=function(a){var b=new glMatrixArrayType(16);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15]}return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],o=a[11],m=a[12],n=a[13],p=a[14];a=a[15];return m*k*h*e-j*n*h*e-m*f*l*e+g*n*l*e+j*f*p*e-g*k*p*e-m*k*d*i+j*n*d*i+m*c*l*i-b*n*l*i-j*c*p*i+b*k*p*i+m*f*d*o-g*n*d*o-m*c*h*o+b*n*h*o+g*c*p*o-b*f*p*o-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],o=a[10],m=a[11],n=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*n,y=k*r-o*n,z=k*s-m*n,C=l*r-o*p,D=l*s-m*p,E=o*s-m*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+o*v-m*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-n*w+r*t-s*B)*q;b[7]=(k*w-o*t+m*B)*q;b[8]=(f*D-h*z+j*x)*q;
b[9]=(-c*D+d*z-g*x)*q;b[10]=(n*v-p*t+s*A)*q;b[11]=(-k*v+l*t-m*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-n*u+p*B-r*A)*q;b[15]=(k*u-l*B+o*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,o=-k*g+h*i,m=j*g-f*i,n=c*l+d*o+e*m;if(!n)return null;n=1/n;b||(b=mat3.create());b[0]=l*n;b[1]=(-k*d+e*j)*n;b[2]=(h*d-e*f)*n;b[3]=o*n;b[4]=(k*c-e*i)*n;b[5]=(-h*c+e*g)*n;b[6]=m*n;b[7]=(-j*c+d*i)*n;b[8]=(f*c-d*g)*n;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],o=a[9],m=a[10],n=a[11],p=a[12],r=a[13],s=a[14];a=a[15];var A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14];b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*o+u*r;c[2]=A*g+B*j+t*m+u*s;c[3]=A*f+B*k+t*n+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*o+y*r;c[6]=v*g+w*j+x*m+y*s;c[7]=v*f+w*k+x*n+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*o+E*r;c[10]=z*
g+C*j+D*m+E*s;c[11]=z*f+C*k+D*n+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*o+b*r;c[14]=q*g+F*j+G*m+b*s;c[15]=q*f+F*k+G*n+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1];b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[12]=a[0]*d+a[4]*e+a[8]*b+a[12];a[13]=a[1]*d+a[5]*e+a[9]*b+a[13];a[14]=a[2]*d+a[6]*e+a[10]*b+a[14];a[15]=a[3]*d+a[7]*e+a[11]*b+a[15];return a}var g=a[0],f=a[1],h=a[2],i=a[3],j=a[4],k=a[5],l=a[6],o=a[7],m=a[8],n=a[9],p=a[10],r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=o;c[8]=m;c[9]=n;c[10]=p;c[11]=r;c[12]=g*d+j*e+m*b+a[12];c[13]=f*d+k*e+n*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+o*e+r*b+a[15];return c};
mat4.scale=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[0]*=d;a[1]*=d;a[2]*=d;a[3]*=d;a[4]*=e;a[5]*=e;a[6]*=e;a[7]*=e;a[8]*=b;a[9]*=b;a[10]*=b;a[11]*=b;return a}c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1];c=c[2];var f=Math.sqrt(e*e+g*g+c*c);if(!f)return null;if(f!=1){f=1/f;e*=f;g*=f;c*=f}var h=Math.sin(b),i=Math.cos(b),j=1-i;b=a[0];f=a[1];var k=a[2],l=a[3],o=a[4],m=a[5],n=a[6],p=a[7],r=a[8],s=a[9],A=a[10],B=a[11],t=e*e*j+i,u=g*e*j+c*h,v=c*e*j-g*h,w=e*g*j-c*h,x=g*g*j+i,y=c*g*j+e*h,z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;if(d){if(a!=d){d[12]=a[12];d[13]=a[13];d[14]=a[14];d[15]=a[15]}}else d=a;d[0]=b*t+o*u+r*v;d[1]=f*t+m*u+s*v;d[2]=k*t+n*u+A*v;d[3]=l*t+p*u+B*
v;d[4]=b*w+o*x+r*y;d[5]=f*w+m*x+s*y;d[6]=k*w+n*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+o*e+r*g;d[9]=f*z+m*e+s*g;d[10]=k*z+n*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[0]=a[0];c[1]=a[1];c[2]=a[2];c[3]=a[3];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[4]=a[4];c[5]=a[5];c[6]=a[6];c[7]=a[7];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];if(c){if(a!=c){c[8]=a[8];c[9]=a[9];c[10]=a[10];c[11]=a[11];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b=a*b;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e=a[0],g=a[1];a=a[2];var f=c[0],h=c[1],i=c[2];c=b[1];var j=b[2];if(e==b[0]&&g==c&&a==j)return mat4.identity(d);var k,l,o,m;c=e-b[0];j=g-b[1];b=a-b[2];m=1/Math.sqrt(c*c+j*j+b*b);c*=m;j*=m;b*=m;k=h*b-i*j;i=i*c-f*b;f=f*j-h*c;if(m=Math.sqrt(k*k+i*i+f*f)){m=1/m;k*=m;i*=m;f*=m}else f=i=k=0;h=j*f-b*i;l=b*k-c*f;o=c*i-j*k;if(m=Math.sqrt(h*h+l*l+o*o)){m=1/m;h*=m;l*=m;o*=m}else o=l=h=0;d[0]=k;d[1]=h;d[2]=c;d[3]=0;d[4]=i;d[5]=l;d[6]=j;d[7]=0;d[8]=f;d[9]=
o;d[10]=b;d[11]=0;d[12]=-(k*e+i*g+f*a);d[13]=-(h*e+l*g+o*a);d[14]=-(c*e+j*g+b*a);d[15]=1;return d};mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4={};quat4.create=function(a){var b=new glMatrixArrayType(4);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3]}return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a==b){a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return a}b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a==b){a[0]*=1;a[1]*=1;a[2]*=1;return a}b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2];a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f==0){b[0]=0;b[1]=0;b[2]=0;b[3]=0;return b}f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2];a=a[3];var f=b[0],h=b[1],i=b[2];b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=a[0];var f=a[1],h=a[2];a=a[3];var i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d;d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=k+g;b[4]=1-(j+e);b[5]=d-f;b[6]=c-h;b[7]=d+f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=0;b[4]=k+g;b[5]=1-(j+e);b[6]=d-f;b[7]=0;b[8]=c-h;b[9]=d+f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};quat4.slerp=function(a,b,c,d){d||(d=a);var e=c;if(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]<0)e=-1*c;d[0]=1-c*a[0]+e*b[0];d[1]=1-c*a[1]+e*b[1];d[2]=1-c*a[2]+e*b[2];d[3]=1-c*a[3]+e*b[3];return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
/*******************************************************
 *******************************************************
 * Utils
 *******************************************************
 ******************************************************/

/**
 * Inheritance
 * This model is based on Douglas Crockford's power constructor
 * With this, function are not constructors anymore, and so the new
 * operator is not needed. We will still use it in our code in case
 * the inheritance model is changed.
 */
function object(o) {
  function F() { };
  if (o) {
    F.prototype = o;
    n = new F();
    n.super = o;
    return n;
  } else {
    return new F();
  }
}

function loadFile(path) {
    var xhr = new XMLHttpRequest;
    xhr.open("get", path, false /* synchronous */);
    xhr.send(null);
    if (xhr.readyState == 4) {
      return text = xhr.responseText;
    }

    return null;
}

function generateArrayWithInitializer(length, generate) {
  var array = new Array(length);
  for (var i = 0; i < length; i++) {
    array[i] = generate();
  }

  return array;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

/*******************************************************
 *******************************************************
 * Webgl base
 *******************************************************
 ******************************************************/

var DEBUG = false;

var gl;
var WebGl = {
  game: null,
  input: new Input(),
  canvas: null,
  init: function() {
    try {
      gl = canvas.getContext("experimental-webgl", { antialias:true });
      if (WebGl.game.width)
        canvas.width = WebGl.game.width;
      if (WebGl.game.height)
        canvas.height = WebGl.game.height;
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL");
    }

    var self = WebGl;
    document.onkeydown = function(event) { 
      self.input.onKeyPressed(event.keyCode);
    };
    document.onkeyup = function(event) {
      self.input.onKeyReleased(event.keyCode);
    };
    document.onmousedown = function(event) {
      self.input.onMouseDown(event);
    }
    document.onmouseup = function(event) {
      self.input.onMouseUp(event);
    }
    document.onmousemove = function(event) {
      self.input.onMouseMove(event);
    }
  },

  run: function() {
    setInterval(WebGl.step, 1000/30);
  },

  step: function() {
    WebGl.game.update();
    WebGl.game.render();
  }
}

/**
 * Modelview matrix
 */
var mv = {
  matrixStack: [],
  matrix: mat4.create(),
  pushMatrix: function() {
    var copy = mat4.create();
    mat4.set(mv.matrix, copy);
    mv.matrixStack.push(copy);
  },
  popMatrix: function() {
    if (mv.matrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mat4.set(mv.matrixStack.pop(), mv.matrix);
  },
  resetWithMatrix: function(m) {
    mv.matrixStack = [];
    mv.matrix = m;
  }
}

/**
 * Global projection matrix
 */
var p = {
  matrix: mat4.create(),
  resetWithMatrix: function(m) {
    p.matrix = m;
 }
}

/**
 * Global context matrices
 * To be updated everytime the camera is commited
 */
var global = {
  mv: mv.matrix,
  mvp: mat4.multiply(p.matrix, mv.matrix, mat4.create())
}

/**
 * Lights
 *
 * light.l[i] is { pos, color, (mvpPos) }
 */
var lights = {
  l: []
}

function Shader() {
  var self = object();

  self.program;
  self.attributes = {};
  self.uniforms = {};
  self.color;

  self.init = function(vertPathName, fragPathName) {
    var shadersData = {
      vertex: { 
        type:gl.VERTEX_SHADER,
        dataPath:vertPathName,
        compiledShader:null
      },
      fragment: { 
        type:gl.FRAGMENT_SHADER,
        dataPath:fragPathName,
        compiledShader:null
      }
    };
    for (var type in shadersData) {
      var shaderData = shadersData[type];
      var shader = gl.createShader(shaderData.type);
      var shaderText = loadFile(shaderData.dataPath);
      gl.shaderSource(shader, shaderText);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw gl.getShaderInfoLog(shader);

      shaderData.compiledShader = shader;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, shadersData.vertex.compiledShader);
    gl.attachShader(shaderProgram, shadersData.fragment.compiledShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    self.program = shaderProgram;
    
    self.attributes = getDefaultAttributes(self.program);
    self.uniforms = getDefaultUniforms(self.program);

    return self;
  }

  self.bind = function() {
    gl.useProgram(self.program);

    // MVP matrices
    gl.uniformMatrix4fv(self.uniforms.pMatrix, false, p.matrix);
    gl.uniformMatrix4fv(self.uniforms.mvMatrix, false, mv.matrix);
    gl.uniformMatrix4fv(self.uniforms.mvpMatrix, false, mat4.multiply(p.matrix, mv.matrix, mat4.create()));
    gl.uniformMatrix4fv(self.uniforms.normalMatrix, false, mat4.transpose(mat4.inverse(mv.matrix, mat4.create())));

    // Lights
    for (var i = 0; i < lights.l.length; i++) {
      gl.uniform4fv(self.uniforms["lightPos" + i], lights.l[i].mvPos);
      gl.uniform4fv(self.uniforms["lightColor" + i], lights.l[i].color);
    }

    // Color
    if (!self.color) {
      self.color = quat4.create([0.598, 0.63, 0.6, 1.0]);
    }
    gl.uniform4fv(self.uniforms.color, self.color);

    return self;
  }

  // Private declarations
  var getDefaultAttributes = function(program) {
    return {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      normalPosition: gl.getAttribLocation(program, "aNormalPosition"),
      texCoord: gl.getAttribLocation(program, "aTexCoord")
    }
  }

  var getDefaultUniforms = function(program) {
    // Scene
    var uniforms = {
      pMatrix: gl.getUniformLocation(program, "uPMatrix"),
      mvMatrix: gl.getUniformLocation(program, "uMVMatrix"), 
      mvpMatrix: gl.getUniformLocation(program, "uMVPMatrix"),
      normalMatrix: gl.getUniformLocation(program, "uNormalMatrix")
    }

    // Light
    for (var i = 0; i < lights.l.length; i++) {
      uniforms["lightPos" + i] = gl.getUniformLocation(self.program, "uLightPos" + i);
      uniforms["lightColor" + i] = gl.getUniformLocation(self.program, "uLightColor" + i);
    }

    uniforms.color = gl.getUniformLocation(program, "uColor");

    return uniforms;
  }

  return self;
}

var MOUSE_KEYCODE = 0;
function Input() {
  var self = object();

  self.keyStates = [];
  self.prevKeyStates = [];
  self.currKeyStates = [];
  
  self.mouseX = 0;
  self.mouseY = 0;
  self.mouseXinc = 0;
  self.mouseYinc = 0;

  self.onKeyPressed = function(keyCode) {
    self.keyStates[keyCode] = true;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

  self.onKeyReleased = function(keyCode) {
    self.keyStates[keyCode] = false;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

  self.onMouseDown = function() {
    self.onKeyPressed(MOUSE_KEYCODE);
  }

  self.onMouseUp = function() {
    self.onKeyReleased(MOUSE_KEYCODE);
  }

  self.onMouseMove = function(event) {
    dirtyMouseX = event.clientX;
    dirtyMouseY = event.clientY;
  }

  self.update = function() {
    var nextNumDirtyKeys = 0;
    for (var i = 0; i < nDirtyKeys; i++) {
      var idx = dirtyKeys[i];
      self.prevKeyStates[idx] = self.currKeyStates[idx];
      self.currKeyStates[idx] = self.keyStates[idx];
      
      // If value has changed, consider them as dirty for next step
      if (self.currKeyStates[idx] ^ self.prevKeyStates[idx]) {
          dirtyKeys[nextNumDirtyKeys++] = idx;
      }
    }
    nDirtyKeys = nextNumDirtyKeys;

    self.mouseXinc = dirtyMouseX - self.mouseX;
    self.mouseYinc = dirtyMouseY - self.mouseY;
    self.mouseX = dirtyMouseX;
    self.mouseY = dirtyMouseY;

    return self;
  }

  self.keyCheck = function(keyCode) {
    return self.currKeyStates[keyCode];
  }

  self.keyPressed = function(keyCode) {
    return self.currKeyStates[keyCode] && !self.prevKeyStates[keyCode];
  }

  self.keyReleased = function(keyCode) {
    return !self.currKeyStates[keyCode] && self.prevKeyStates[keyCode];
  }

  // Private data
  var dirtyKeys = [];
  var nDirtyKeys = 0;
  var dirtyMouseX = self.mouseX;
  var dirtyMouseY = self.mouseY;

  return self;
}

/*******************************************************
 *******************************************************
 * View math
 *******************************************************
 ******************************************************/

function Camera() {
  var self = object();

  self.mvMatrix = mat4.create();
  self.pMatrix = mat4.create();

  self.pitchAngle;
  self.yawAngle;
  self.rollAngle;
  self.pos;

  self.target;
  self.targetOffsetTransform;

  /**
   * Stablishes this object as the current MVP matrix wrapper
   *
   * @param mat4 target Transform matrix defining the frame whose origin will be
   * the lock-on target of this camera
   *
   * @param object vv Object containing the parameters of the camera's view volume
   */
  self.init = function(vv) {
    self.pitchAngle = self.yawAngle = self.rollAngle = 0;
    self.pos = quat4.create([0, 0, 0, 1]);

    if (vv) {
      mat4.frustum(vv.xL, vv.xR, vv.yB, vv.yT, vv.N, vv.F, self.pMatrix);
    } else {
      mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, self.pMatrix);
    }

    mat4.identity(self.mvMatrix);

    return self;
  }

  /* After this call, accessing self.mvMatrix will have the same
   * effect as accessing mv.matrix (same with self.pMatrix and p.matrix)
   */
  self.activate = function() {
    mv.resetWithMatrix(self.mvMatrix);
    p.resetWithMatrix(self.pMatrix);

    return self;
  }

  self.isActive = function() {
    return mv.matrix == self.mvMatrix;
  }

  self.translate = function(t) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, t);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    vec3.add(self.pos, t);
    
    return self;
  }

  self.translateX = function(tx) {
    self.translate([tx, 0, 0]);

    return self;
  }

  self.translateY = function(ty) {
    self.translate([0, ty, 0]);

    return self;
  }

  self.translateZ = function(tz) {
    self.translate([0, 0, tz]);

    return self;
  }

  self.pitch = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateX(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.pitchAngle += alpha;
    
    return self;
  }

  self.yaw = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateY(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.yawAngle += alpha;

    return self;
  }

  self.poleyaw = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateX(m, self.pitchAngle);
    mat4.rotateY(m, alpha);
    mat4.rotateX(m, -self.pitchAngle);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    // uh?
    self.yawAngle += alpha;

    return self;
  }

  self.roll = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateZ(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.rollAngle += alpha;

    return self;
  }

  self.orbitatepitch = function(alpha) {
    mat4.rotateX(self.mvMatrix, alpha);
    self.pitchAngle += alpha;

    return self;
  }

  self.orbitatepoleyaw = function(alpha) {
    mat4.rotateX(self.mvMatrix, -self.pitchAngle);
    mat4.rotateY(self.mvMatrix, alpha);
    mat4.rotateX(self.mvMatrix, self.pitchAngle);

    self.yawAngle += alpha;

    return self;
  }

  self.orbitateyaw = function(alpha) {
    mat4.rotateY(self.mvMatrix, alpha);
    self.yawAngle += alpha;

    return self;
  }

  self.orbitateroll = function(alpha) {
    mat4.rotateZ(self.mvMatrix, alpha);
    self.rollAngle += alpha;

    return self;
  }  

  self.lockOn = function(transform, offsetTransform) {
    self.target = transform;
    self.targetOffsetTransform = offsetTransform;

    return self;
  }

  self.lockOff = function() {
    self.target = null;

    return self;
  }

  self.commit = function() {
    if (self.target) {
      mat4.inverse(self.target, self.mvMatrix);
      mat4.multiply(self.targetOffsetTransform, self.mvMatrix, self.mvMatrix);
    } else {
      // nothing to do here, really
    }

    // Compute global params
    global.mv = mv.matrix;
    global.mvp = mat4.multiply(p.matrix, mv.matrix, global.mvp);

    // Lights
    for (var i = 0; i < lights.l.length; i++) {
      lights.l[i].mvPos = mat4.multiplyVec4(global.mv, lights.l[i].pos, quat4.create());
      lights.l[i].mvpPos = mat4.multiplyVec4(global.mvp, lights.l[i].pos, quat4.create());
    }

    return self;
  }

  return self;
}


/*******************************************************
 *******************************************************
 * Game arquitecture
 *******************************************************
 ******************************************************/

function Game() {
  var self = object();

  self.width;
  self.height;
  self.world;
  self.input;

  self.initSettings = function() {
    self.width = 640;
    self.height = 480;

    return self;
  }
    
  self.init = function(canvas) {
    self.initSettings();
    WebGl.game = self;
    WebGl.canvas = self;
    WebGl.init();
    self.input = WebGl.input;

    return self;

  }

  self.update = function() {
    self.input.update();
    self.world.update();

    return self;
  }

  self.render = function() {
    self.world.render();

    return self;
  }

  self.changeWorld = function(world) {
    world.init(self);
    self.world = world;

    return self;
  }

  self.run = function() {
    WebGl.run();

    return self;
  }

  return self;
}

function GameState() {
  var self = object();

  self.game;
  self.camera;

  self.entities = [];
  self.incomingEntities = [];
  self.outgoingEntities = [];

  self.init = function(game) {
    self.game = game;
    self.camera = new Camera();

    return self;
  }

  self.update = function() {
    for (var i = 0; i < self.incomingEntities.length; i++) {
      self.incomingEntities[i].init(game, self);
      self.entities.push(self.incomingEntities[i]);
    }
    self.entities = self.entities.filter(function (i) { return self.outgoingEntities.indexOf(i) < 0; });
    self.incomingEntities = [];
    self.outgoingEntities = [];

    for (var i = 0; i < self.entities.length; i++) {
      var entity = self.entities[i];
      if (entity.timers) {
        // HACK: doing this inside entity's update will always call super's onTimer
        // because of how (wrongly) we do inheritance
        // That's we send the callback ourselves (entity.setTimer)
        entity.updateTimer(entity.onTimer);
      }
      entity.update();
    }

    return self;
  }

  self.render = function() {
    self.camera.commit();
    return self;
  }

  return self;
}

var TYPE_ENTITY = 'e';
function Entity() {
  var self = object();

  self.game;
  self.world;
  self.mesh;
  self.shader;
  self.bbox;

  self.transform = mat4.identity(mat4.create());
  self.pitchAngle = 0;
  self.yawAngle = 0;
  self.rollAngle = 0;
  self.pos = quat4.create([0, 0, 0, 1]);

  self.timers = [];

  self.type;

  self.init = function(game, world) {
    self.game = game;
    self.world = world;

    self.type = TYPE_ENTITY; // entity

    return self;
  }

  self.update = function() {
    return self;
  }

  self.render = function() {
    if (DEBUG && self.bbox) {
      self.bbox.bind();
      self.bbox.compile(self.bbox.shader);
      self.bbox.render();
      self.bbox.unbind();

      return self;
    }

    mv.pushMatrix();
      mat4.multiply(mv.matrix, self.transform, mv.matrix);

      if (self.mesh) {
        self.mesh.render();
      }

    mv.popMatrix();

    return self;
  }

  self.onCollide = function() {}

  self.onTimer = function(i) {}

  self.updateTimer = function(callback) {
    for (var i = 0; i < self.timers.length; i++) {
      if (!isNaN(self.timers[i]) || self.timers[i] >= 0) {
        self.timers[i]--;
        if (self.timers[i] < 0) {
          callback(i);
        }
      }
    }
  }

  self.translate = function(t) {
    mat4.translate(self.transform, t);
    vec3.add(self.pos, t);

    return self;
  }

  self.translateX = function(tx) {
    self.translate([tx, 0, 0]);

    return self;
  }

  self.translateY = function(ty) {
    self.translate([0, ty, 0]);

    return self;
  }

  self.translateZ = function(tz) {
    self.translate([0, 0, tz]);

    return self;
  }

  self.pitch = function(alpha) {
    mat4.rotateX(self.transform, alpha);
    self.pitchAngle += alpha;

    return self;
  }

  self.poleyaw = function(alpha) {
    mat4.rotateX(self.transform, -self.pitchAngle);
    mat4.rotateY(self.transform, alpha);
    mat4.rotateX(self.transform, self.pitchAngle);

    self.yawAngle += alpha;

    return self;
  }

  self.yaw = function(alpha) {
    mat4.rotateY(self.transform, alpha);
    self.yawAngle += alpha;

    return self;
  }

  self.roll = function(alpha) {
    mat4.rotateZ(self.transform, alpha);
    self.rollAngle += alpha;

    return self;
  }

  self.copyTransform = function(entity) {
    self.transform = mat4.set(entity.transform, mat4.create());

    self.pitchAngle = entity.pitchAngle;
    self.yawAngle = entity.yawAngle;
    self.rollAngle = entity.rollAngle;

    self.pos = quat4.set(entity.pos, quat4.create());

    return self;
  }

  return self;
}
/*******************************************************
 *******************************************************
 * Geometry
 *******************************************************
 ******************************************************/

function Face() {
  var self = object();

  self.vertexNormalPairs;

  self.init = function(nvertex) {
    self.vertexNormalPairs = generateArrayWithInitializer(nvertex, function() { return {} });
  }

  self.nextVertex = function(idx) {
    return (idx + 1) % self.vertexNormalPairs.length;
  }

  self.computeNormal = function(vertexPool) {
    
    var out = quat4.create(); out[0] = out[1] = out[2] = out[3] = 0;
    for (var i = 0; i < self.vertexNormalPairs.length; i++) {
        var ni = self.nextVertex(i);
        // (yi - suc(yi))*(zi + suc(zi))
        out[0] += (vertexPool[self.vertexNormalPairs[i].vertex][1] - vertexPool[self.vertexNormalPairs[ni].vertex][1]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][2] + vertexPool[self.vertexNormalPairs[ni].vertex][2]);

        // (zi - suc(zi))*(xi + suc(xi))
        out[1] += (vertexPool[self.vertexNormalPairs[i].vertex][2] - vertexPool[self.vertexNormalPairs[ni].vertex][2]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][0] + vertexPool[self.vertexNormalPairs[ni].vertex][0]);

        // (xi - suc(xi))*(yi + suc(yi))
        out[2] += (vertexPool[self.vertexNormalPairs[i].vertex][0] - vertexPool[self.vertexNormalPairs[ni].vertex][0]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][1] + vertexPool[self.vertexNormalPairs[ni].vertex][1]);
    }

   	return out;
  }

  self.computeCenter = function(vertexPool) {
    // TODO: test
    var center = quat4.create(); out[0] = out[1] = out[2] = 0; out[3] = 1;
    var nvertex = self.vertexNormalPairs.length;
    for (var i = 0; i < nvertex; i++) {
        center[0] += vertexPool[self.vertexNormalPairs[i].vertex][0];
        center[1] += vertexPool[self.vertexNormalPairs[i].vertex][1];
        center[2] += vertexPool[self.vertexNormalPairs[i].vertex][2];
    }

    center[0] /= nvertex;
    center[1] /= nvertex;
    center[2] /= nvertex;
        
    return center;
  }

  return self;
}

/*
 * Vertext have to be specified clockwise by an outside party
 */
function Mesh() {
  var self = object();

  self.vertexPool;
  self.normalPool;
  self.edgePool;
  self.globalVertexPool;
  self.globalNormalPool;
  self.globalEdgePool;

  self.faces;
  self.shader;

  self.compiledVertex;
  self.compiledVertexBuffer;

  self.init = function(nvertex, nnormals) {
    self.vertexPool = generateArrayWithInitializer(nvertex, function() { return quat4.create() });
    self.normalPool = generateArrayWithInitializer(nnormals, function() { return vec3.create() });
    self.edgePool = generateArrayWithInitializer(nvertex + nnormals - 2, function() { return vec3.create() });
    self.faces = generateArrayWithInitializer(nnormals, function() { return new Face(); });

    return self;
  }

  self.computeNormals = function() {
    for (var i = 0; i < self.faces.length; i++) {
      self.normalPool[i] = self.faces[i].computeNormal(self.vertexPool);
      for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
        self.faces[i].vertexNormalPairs[j].normal = i;
      }
    }

    return self;
  }

  self.computeEdges = function() {
    var nfaces = self.faces.length;
    var nvertex = self.vertexPool.length;
    var nedgespool = 0;
    for (var i = 0; i < self.faces.length; i++) {
      var face = self.faces[i];
      for (var j = 1; j < face.vertexNormalPairs.length; j++) {
        var edge = vec3.subtract(self.vertexPool[face.vertexNormalPairs[j].vertex], self.vertexPool[face.vertexNormalPairs[j-1].vertex], vec3.create());
        if (self.edgePool.indexOf(edge) < 0) {
          self.edgePool[nedgespool++] = edge;
        }
      }
    }

    return self;
  }

  self.compile = function(shader) {

    var compiledVertexCount = 0;
    for (var i = 0; i < self.faces.length; i++) {
      for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
        compiledVertexCount++;
      }
    }

    self.compiledVertex = new Array(compiledVertexCount * 6); // 3 vertex, 3 normal
    var n = 0;
    for (var i = 0; i < self.faces.length; i++) {
        for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
            var iV = self.faces[i].vertexNormalPairs[j].vertex;
            var iN = self.faces[i].vertexNormalPairs[j].normal;
            for (var k = 0; k < 3; k++) {
                self.compiledVertex[n + k] = self.vertexPool[iV][k];
                self.compiledVertex[n + k + 3] = self.normalPool[iN][k];
            }
            n += 6;
        }
    }

    self.compiledVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, self.compiledVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.compiledVertex), gl.STATIC_DRAW);
    self.compiledVertexBuffer.itemSize = 6;
    self.compiledVertexBuffer.numItems = compiledVertexCount;

    self.shader = shader;

    return self;
  }

  self.render = function(drawingPrimitive) {
    if (self.shader) {
      self.shader.bind();

      // Geometry attribs
      gl.bindBuffer(gl.ARRAY_BUFFER, self.compiledVertexBuffer);
      gl.enableVertexAttribArray(self.shader.attributes.vertexPosition);
      gl.enableVertexAttribArray(self.shader.attributes.normalPosition);
      gl.vertexAttribPointer(self.shader.attributes.vertexPosition, 3, gl.FLOAT, false, 6 * 4, 0);
      gl.vertexAttribPointer(self.shader.attributes.normalPosition, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

      if (!drawingPrimitive) {
        drawingPrimitive = gl.TRIANGLES;
      }

      gl.drawArrays(drawingPrimitive, 0, self.compiledVertexBuffer.numItems);
      
      gl.disableVertexAttribArray(self.shader.attributes.vertexPosition);
      gl.disableVertexAttribArray(self.shader.attributes.normalPosition);
    }

    return self;
  }

  self.collides = function(other) {
    var myLocalVertexPool = self.vertexPool;
    var myLocalNormalPool = self.normalPool;
    var myLocalEdgePool = self.edgePool;
    var otherLocalVertexPool = other.vertexPool;
    var otherLocalNormalPool = other.normalPool;
    var otherLocalEdgePool = other.edgePool;

    self.vertexPool = self.globalVertexPool;
    self.normalPool = self.globalNormalPool;
    self.edgePool = self.globalEdgePool;
    other.vertexPool = other.globalVertexPool;
    other.normalPool = other.globalNormalPool;
    other.edgePool = other.globalEdgePool;

    var intersect = true;

    // Test using self normals as separating axis
    if (intersect) {
      for (var i = 0; i < self.faces.length; i++) {
        var normal = self.normalPool[self.faces[i].vertexNormalPairs[0].normal];
        if (!intersectOnProjection(self, other, normal)) {
          intersect = false;
        }
      }
    }
    
    // Test using other normals as separating axis
    if (intersect) {
      for (var i = 0; i < other.faces.length; i++) {
        var normal = other.normalPool[other.faces[i].vertexNormalPairs[0].normal];
        if (!intersectOnProjection(other, self, normal)) {
          intersect = false;
        }
      }
    }

    // Test using the cross product of the edges as separating axis
    if (intersect) {
      for (var i = 0; i < self.edgePool.length; i++) {
        for (var j = 0; j < other.edgePool.length; j++) {
          var normal = vec3.cross(self.edgePool[i], other.edgePool[j]);
          if (!intersectOnProjection(self, other, normal)) {
            intersect = false;
          }
        }
      }
    }

    self.vertexPool = myLocalVertexPool;
    self.normalPool = myLocalNormalPool;
    self.edgePool = myLocalEdgePool;
    other.vertexPool = otherLocalVertexPool;
    other.normalPool = otherLocalNormalPool;
    other.edgePool = otherLocalEdgePool;

    return intersect;
  }

  /**
   * Computes the projection interval of this polyhedron onto the given vector (min and max projected vertices)
   */
  self.computeProjectionInterval = function(vector) {
    var max = min = null;

    // console.log("--------- vector ", logvertex(vector));
    for (var i = 0; i < self.vertexPool.length; i++) {
      projectedVertex = vec3.dot(vector, self.vertexPool[i]);
      max = max != null ? Math.max(max, projectedVertex) : projectedVertex;
      min = min != null ? Math.min(min, projectedVertex) : projectedVertex;
    }

    return [min, max];
  }

  self.generateGlobalPools = function(transform) {
    var varray = new Array(self.vertexPool.length);
    for (var i = 0; i < varray.length; i++) {
      varray[i] = mat4.multiplyVec4(transform, self.vertexPool[i], quat4.create());
    }
 
    // Store base values in tmp vars
    localVertexPool = self.vertexPool;
    localNormalPool = self.normalPool;
    localEdgePool = self.edgePool;

    // Compute global values
    self.vertexPool = varray;
    self.normalPool = new Array(self.vertexPool.length);
    self.edgePool = new Array(self.vertexPool.length);
    self.computeNormals().computeEdges();

    // Store global values
    self.globalVertexPool = varray;
    self.globalNormalPool = self.normalPool;
    self.globalEdgePool = self.edgePool;

    // Swap values back
    self.vertexPool = localVertexPool;
    self.normalPool = localNormalPool;
    self.edgePool = localEdgePool;

    return self;
  }

  self.bind = function() {
    localVertexPool = self.vertexPool;
    localNormalPool = self.normalPool;
    localEdgePool = self.edgePool;

    self.vertexPool = self.globalVertexPool;
    self.normalPool = self.globalNormalPool;
    self.edgePool = self.globalEdgePool;
  }

  self.unbind = function() {
    self.vertexPool = localVertexPool;
    self.normalPool = localNormalPool;
    self.edgePool = localEdgePool;

    localVertexPool = localNormalPool = localEdgePool = null;
  }

  var intersectOnProjection = function(polyedraA, polyedraB, vector) {
    var myInterval = polyedraA.computeProjectionInterval(vector);
    var otherInterval = polyedraB.computeProjectionInterval(vector);

    var intersection = [ Math.max(myInterval[0], otherInterval[0]), Math.min(myInterval[1], otherInterval[1])];
    return intersection[0] <= intersection[1];
  }

  var localVertexPool
    , localNormalPool
    , localEdgePool;

  return self;
}

function Cube() {
  var self = object(new Mesh());

  self.init = function(xs, ys, zs) {
    self.super.init(8, 12);

    var halfxs = xs / 2;
    var halfys = ys / 2;
    var halfzs = zs / 2;

    self.vertexPool[0] = quat4.create([-halfxs, -halfys, -halfzs, 1]);
    self.vertexPool[1] = quat4.create([-halfxs, -halfys, halfzs, 1]);
    self.vertexPool[2] = quat4.create([-halfxs, halfys, -halfzs, 1]);
    self.vertexPool[3] = quat4.create([-halfxs, halfys, halfzs, 1]);
    self.vertexPool[4] = quat4.create([halfxs, -halfys, -halfzs, 1]);
    self.vertexPool[5] = quat4.create([halfxs, -halfys, halfzs, 1]);
    self.vertexPool[6] = quat4.create([halfxs, halfys, -halfzs, 1]);
    self.vertexPool[7] = quat4.create([halfxs, halfys, halfzs, 1]);

    self.faces[0].init(3);
    self.faces[0].vertexNormalPairs[0].vertex = 4;
    self.faces[0].vertexNormalPairs[1].vertex = 6;
    self.faces[0].vertexNormalPairs[2].vertex = 5;
    self.faces[1].init(3);
    self.faces[1].vertexNormalPairs[0].vertex = 5;
    self.faces[1].vertexNormalPairs[1].vertex = 6;
    self.faces[1].vertexNormalPairs[2].vertex = 7;

    self.faces[2].init(3);
    self.faces[2].vertexNormalPairs[0].vertex = 6;
    self.faces[2].vertexNormalPairs[1].vertex = 2;
    self.faces[2].vertexNormalPairs[2].vertex = 7;
    self.faces[3].init(3);
    self.faces[3].vertexNormalPairs[0].vertex = 7;
    self.faces[3].vertexNormalPairs[1].vertex = 2;
    self.faces[3].vertexNormalPairs[2].vertex = 3;

    self.faces[4].init(3);
    self.faces[4].vertexNormalPairs[0].vertex = 2;
    self.faces[4].vertexNormalPairs[1].vertex = 0;
    self.faces[4].vertexNormalPairs[2].vertex = 3;
    self.faces[5].init(3);
    self.faces[5].vertexNormalPairs[0].vertex = 3;
    self.faces[5].vertexNormalPairs[1].vertex = 0;
    self.faces[5].vertexNormalPairs[2].vertex = 1;

    self.faces[6].init(3);
    self.faces[6].vertexNormalPairs[0].vertex = 0;
    self.faces[6].vertexNormalPairs[1].vertex = 4;
    self.faces[6].vertexNormalPairs[2].vertex = 1;
    self.faces[7].init(3);
    self.faces[7].vertexNormalPairs[0].vertex = 1;
    self.faces[7].vertexNormalPairs[1].vertex = 4;
    self.faces[7].vertexNormalPairs[2].vertex = 5;

    self.faces[8].init(3);
    self.faces[8].vertexNormalPairs[0].vertex = 7;
    self.faces[8].vertexNormalPairs[1].vertex = 3;
    self.faces[8].vertexNormalPairs[2].vertex = 5;
    self.faces[9].init(3);
    self.faces[9].vertexNormalPairs[0].vertex = 5;
    self.faces[9].vertexNormalPairs[1].vertex = 3;
    self.faces[9].vertexNormalPairs[2].vertex = 1;

    self.faces[10].init(3);
    self.faces[10].vertexNormalPairs[0].vertex = 4;
    self.faces[10].vertexNormalPairs[1].vertex = 0;
    self.faces[10].vertexNormalPairs[2].vertex = 6;
    self.faces[11].init(3);
    self.faces[11].vertexNormalPairs[0].vertex = 6;
    self.faces[11].vertexNormalPairs[1].vertex = 0;
    self.faces[11].vertexNormalPairs[2].vertex = 2;

    self.computeNormals().computeEdges();

    return self;
  }

  return self;
}
var PITCH_STATE = {
  IDLE: 0,
  UP: 1,
  DOWN: 2
}
var YAW_STATE = {
  IDLE: 0,
  LEFT: 1,
  RIGHT: 2
}
PITCH_TIMER = 0;
YAW_TIMER = 1;
ROTATION_TIME = 10;
ROTATION_TIME_OFFSET = 40;
IDLE_TIME = 10;
IDLE_TIME_OFFSET = 50;
function LogoLevel() {
  var self = object(new GameState());

  self.logo = new Logo();
  self.camera;
  self.playerCamera;

  self.pitchState;
  self.yawState;

  self.lightPos;

  self.timers = [];

  self.init = function(game) {
    self.super.init(game);

    /*****************
    /* Camera setup
    /****************/
    // View Volume
    var vv = {};
    vv.N = 0.1;
    vv.F = 1000;
    vv.xR = 0.05;
    vv.xL = - vv.xR;
    vv.yT = vv.xR * gl.viewportHeight / gl.viewportWidth;
    vv.yB = - vv.yT;
    // Main camera setup
    self.camera.init(vv).translate([0, 0, -3]).activate();
    self.camera.activate();

    /*****************
    /* Scene setup
    /****************/
    // Lights
    lights.l[0] = {
      pos: quat4.create([1.5, 3.0, 100.0, 1.0]),
      color: quat4.create([1.0, 1.0, 1.0, 1.0])
    }

    /****************
    /* Entities setup
    /***************/
    // Player
    self.entities.push(new DotGenerator([0.4, -0.05, 0.5]).init(self.game, self));
    self.entities.push(new DotGenerator([0.5, -0.05, 0.5]).init(self.game, self));
    self.entities.push(new DotGenerator([0.6, -0.05, 0.5]).init(self.game, self));
    
    self.logo.init(self.game, self);
    self.entities.push(self.logo);

    switchYawState(YAW_STATE.IDLE);
    switchPitchState(PITCH_STATE.IDLE);

    return self;
  }

  self.render = function() {
    self.super.render();
 
    // Clear view
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // Draw player
    for (var i = 0; i < self.entities.length; i++) {
        self.entities[i].render();
    }

    return self;
  }

  self.update = function() {
    self.super.update();

    for (var i = 0; i < self.timers.length; i++) {
      if (!isNaN(self.timers[i]) || self.timers[i] >= 0) {
        self.timers[i]--;
        if (self.timers[i] < 0) {
          onTimer(i);
        }
      }
    }    

    if (self.game.input.keyCheck(66)) {
      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);
    }

    if (self.game.input.keyCheck(MOUSE_KEYCODE)) {  // Mouse click
      var yaw = 0, pitch = 0;
      yaw += self.game.input.mouseXinc / 500;
      pitch += self.game.input.mouseYinc / 500;
      self.camera.orbitatepoleyaw(yaw).orbitatepitch(pitch);

      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);

      restore = false;
    } else if (self.game.input.keyReleased(MOUSE_KEYCODE)) {  // Mouse release
      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);

      forceRestore();
    } else {
      if (restore) {
        forceRestore();
      } else {
        var rinc = 0.0001;
        var maxSpeed = 0.005;
        switch (self.pitchState) {
          case PITCH_STATE.IDLE:
            if (self.camera.pitchAngle > maxSpeed) {
              pitchSpeed = Math.max(-maxSpeed, pitchSpeed - rinc);
            } else if (self.camera.pitchAngle < -maxSpeed) {
              pitchSpeed = Math.min(maxSpeed, pitchSpeed + rinc);
            } else if (self.camera.pitchAngle != 0) {
              pitchSpeed = 0;
              self.camera.orbitatepitch(-self.camera.pitchAngle);
            }
            break;
          case PITCH_STATE.UP:
            pitchSpeed = Math.min(maxSpeed, pitchSpeed + rinc);
            break;
          case PITCH_STATE.DOWN:
            pitchSpeed = Math.max(-maxSpeed, pitchSpeed - rinc);
            break;
        }

        switch (self.yawState) {
          case YAW_STATE.IDLE:
            if (self.camera.yawAngle > maxSpeed) {
              yawSpeed = Math.max(-maxSpeed, yawSpeed - rinc);
            } else if (self.camera.yawAngle < -maxSpeed) {
              yawSpeed = Math.min(maxSpeed, yawSpeed + rinc);
            } else if (self.camera.yawAngle != 0) {
              yawSpeed = 0;
              self.camera.orbitatepoleyaw(yawSpeed);
            }
            break;
          case YAW_STATE.LEFT:
            yawSpeed = Math.max(-maxSpeed, yawSpeed - rinc);
            break;
          case YAW_STATE.RIGHT:
            yawSpeed = Math.min(maxSpeed, yawSpeed + rinc);
            break;
        }
        self.camera.orbitatepoleyaw(yawSpeed).orbitatepitch(pitchSpeed);
      }
    }
  }

  var forceRestore = function() {
    var restorepitchinc = 0.1;
    var restoreyawinc = 0.1;
    var yaw = 0, pitch = 0;
    if (self.camera.yawAngle > restoreyawinc) {
      yaw -= restoreyawinc;
    } else if (self.camera.yawAngle < -restoreyawinc) {
      yaw += restoreyawinc;
    } else if (self.camera.yawAngle != 0) {
      yaw -= self.camera.yawAngle;
    }
    if (self.camera.pitchAngle > restorepitchinc) {
      pitch -= restorepitchinc;
    } else if (self.camera.pitchAngle < -restorepitchinc) {
      pitch += restorepitchinc;
    } else if (self.camera.pitchAngle != 0) {
      pitch -= self.camera.pitchAngle;
    }

    self.camera.orbitatepoleyaw(yaw).orbitatepitch(pitch);
    
    restore = self.camera.pitchAngle !== 0 || self.camera.yawAngle !== 0;
  }

  var onTimer = function(i) {
    // Change directions
    var stateObject;
    if (i == YAW_TIMER) {
      stateObject = {
        'idle': YAW_STATE.IDLE,
        'one': YAW_STATE.LEFT,
        'other': YAW_STATE.RIGHT,
        'switch': switchYawState
      };
    } else if (i == PITCH_TIMER) {
      stateObject = {
        'idle': PITCH_STATE.IDLE,
        'one': PITCH_STATE.UP,
        'other': PITCH_STATE.DOWN,
        'switch': switchPitchState
      };
    }

    if (self.state === stateObject.idle) {
      switch (Math.round(Math.random() * 1)) {
        case 0:
          stateObject['switch'](stateObject.one);
          break;
        case 1:
          stateObject['switch'](stateObject.other);
          break;
      }
    } else {
      // If already changing, then most likely go back to idle
      switch (Math.round(Math.random() * 4)) {
        case 0:
          stateObject['switch'](stateObject.one);
          break;
        case 1:
          stateObject['switch'](stateObject.other);
          break;
        case 2:
        case 3:
        case 4:
          stateObject['switch'](stateObject.idle);
          break;
      }
    }
  }

  var yawSpeed = 0;
  var pitchSpeed = 0;
  var restore = false;

  var switchYawState = function(nextState) {
    self.yawState = nextState;
    var time;
    if (nextState == YAW_STATE.IDLE) {
      time = IDLE_TIME;
      timeoffset = IDLE_TIME_OFFSET;
    } else {
      time = ROTATION_TIME;
      timeoffset = ROTATION_TIME_OFFSET;
    }
    self.timers[YAW_TIMER] = Math.random() * time + timeoffset;
  }

  var switchPitchState = function(nextState) {
    self.pitchState = nextState;
    var time;
    if (nextState == PITCH_STATE.IDLE) {
      time = IDLE_TIME;
      timeoffset = IDLE_TIME_OFFSET;
    } else {
      time = ROTATION_TIME;
      timeoffset = ROTATION_TIME_OFFSET;
    }
    self.timers[PITCH_TIMER] = Math.random() * time + timeoffset;
  }

  return self;
}

function Dot(lifespan) {
  var self = object(new Entity());

  self.alive = true;
  self.lifespan = Math.random()*20 + 30;
  self.maxLifespan = self.lifespan;

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = quat4.create([0.1, 0.1, 0.1, 1.0]);

    // Mesh dimensions
    var xs = 0.03,
        ys = 0.03,
        zs = 0.001;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);
    self.super.mesh = m;

    self.generateDirection();

    return self;
  }

  self.generateDirection = function() {
    var random = Math.random()/300 - 1 / 600;
    var randomProp = Math.random();
    var tx = random * randomProp;
    var ty = random * (1 - randomProp)
    dir = [tx, ty, 0];
  }

  self.regenerate = function() {
    self.alive = true;
    self.lifespan = self.maxLifespan;
    self.generateDirection();
  }

  self.update = function() {
    var alpha = 1.0;
    var uplimit = 0.6 * self.maxLifespan;
    var downlimit = 0.4 * self.maxLifespan;
    if (self.lifespan > uplimit) {
      alpha = 1 - (self.lifespan - uplimit) / (self.maxLifespan - uplimit);
    } else if (self.lifespan < downlimit) {
      alpha = self.lifespan / downlimit;
    }
    self.super.mesh.shader.color[3] = alpha;
    self.translate(dir);
    
    self.lifespan--;
    if (self.lifespan < 0) {
      self.alive = false;
    }
  }

  var dir;

  return self;
}

function DotGenerator(toffset) {
  var self = object();

  self.game;
  self.world;

  self.enemy;

  self.init = function(game, world) {
    self.game = game;
    self.world = world;

    return self;
  }

  self.update = function() {
    if (!self.dot || !self.dot.alive) {
      self.spawnDot();
    }
  }

  self.render = function() {}

  self.spawnDot = function() {
    if (!self.dot) {
      self.dot = new Dot();
      self.dot.translate(toffset);
      self.world.incomingEntities.push(self.dot);
    } else {
      self.dot.regenerate();
      mat4.identity(self.dot.transform);
      self.dot.translate(toffset);
    }
  }

  return self;
}

function Logo() {
  var self = object(new Entity());

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = quat4.create([1.0, 1.0, 1.0, 1.0]);

    // Mesh dimensions
    var xs = 1,
        ys = 1,
        zs = 1;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);

    self.super.mesh = m;
    
    self.super.bbox = new Cube().init(xs, ys, zs).compile(shader);

    /******************
    /* Hardcoded logo
    /*****************/
    // Shaders
    logoShader = new Shader().init("shaderTexture.vs", "shaderTexture.fs");
    logoShader.color = quat4.create([1.0, 1.0, 1.0, 1.0]);
    // Buffers
    logoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, logoBuffer);
    // Grid
    xs = xs / 2;
    ys = ys / 2;
    zs = zs / 2;
    var vertices = [
      -xs, -ys, zs, 0, 0, 1, 0.0, 0.0,
      xs, -ys, zs, 0, 0, 1, 1.0, 0.0,
      -xs, ys, zs, 0, 0, 1, 0.0, 1.0,
      xs, -ys, zs, 0, 0, 1, 1.0, 0.0,
      -xs, ys, zs, 0, 0, 1, 0.0, 1.0,
      xs, ys, zs, 0, 0, 1, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    logoBuffer.itemSize = 8;
    logoBuffer.numItems = vertices.length / logoBuffer.itemSize;
    // Texture
    logoTexture = gl.createTexture();
    logoTexture.image = new Image();
    logoTexture.image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, logoTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, logoTexture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null);

      logoShader.uniforms.texture0 = gl.getUniformLocation(logoShader.program, "uTexSampler0");
    }
    logoTexture.image.src = "soon_logo.png";

    return self;
  }

  self.render = function() {

    // Draw floor
    mv.pushMatrix();
      mat4.multiply(mv.matrix, self.transform, mv.matrix);

      logoShader.bind();
      gl.enableVertexAttribArray(logoShader.attributes.vertexPosition);
      gl.enableVertexAttribArray(logoShader.attributes.normalPosition);

      gl.bindBuffer(gl.ARRAY_BUFFER, logoBuffer);
      gl.vertexAttribPointer(logoShader.attributes.vertexPosition, 3, gl.FLOAT, false, logoBuffer.itemSize*4, 0);
      gl.vertexAttribPointer(logoShader.attributes.normalPosition, 3, gl.FLOAT, false, logoBuffer.itemSize*4, 3*4);
      if (logoShader.attributes.texCoord >= 0) {
        gl.enableVertexAttribArray(logoShader.attributes.texCoord);
        gl.vertexAttribPointer(logoShader.attributes.texCoord, 2, gl.FLOAT, false, logoBuffer.itemSize*4, 6*4);
      
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, logoTexture);
        gl.uniform1i(logoShader.uniforms.texture0, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, logoBuffer.numItems);

      gl.disableVertexAttribArray(logoShader.attributes.vertexPosition);
      gl.disableVertexAttribArray(logoShader.attributes.normalPosition);
      if (logoShader.attributes.texCoord >= 0) {
        gl.disableVertexAttribArray(logoShader.attributes.texCoord);
      }
    mv.popMatrix();

    self.super.render();
  }

  var logoBuffer;
  var logoTexture;
  var logoShader;

  return self;
}

function LogoGame() {
  var self = object(new Game());
  
  self.initSettings = function() {
    self.width = 400;
    self.height = 100;

    return self;
  }

  self.init = function() {
    self.super.init();

    self.changeWorld(new LogoLevel());

    return self;
  }

  self.update = function() {
    self.super.update();

    return self;
  }

  return self;
}

/*******************************************************
 *******************************************************
 * Main
 *******************************************************
 ******************************************************/

function main() {
    var canvas = document.getElementById("canvas");

    game = new LogoGame().init(canvas).run();
}
